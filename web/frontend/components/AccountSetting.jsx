import {
    Button,
    Layout, Card, Form, TextField, FormLayout, Icon, Spinner
} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";
import {
    CircleChevronLeftMinor,
    CircleTickMinor,
    StatusActiveMajor
} from '@shopify/polaris-icons';
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {useAuthenticatedFetch} from "../hooks";
import {notEmptyString, useField, useForm} from "@shopify/react-form";

export default function AccountSetting(){
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [basicPlanBtn, setBasicPlanBtn] = useState(false);
    const [premiumPlanBtn, setPremiumPlanBtn] = useState(false);
    const [unsubscribeBtn, setUnsubscribeBtn] = useState(false);
    const [subscriber, setSubscriber] = useState({});
    const [selectedPlan, setSelectedPlan] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const checkSubscription = useCallback( async () => {
        setIsLoading(true);
        const url = `/api/media_icons/subscriptions/check`;
        const method = "GET";
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if(response.ok){
            const data = await response.json();
            if(data.status !== "active"){
                navigate("/")
            }
        }else {
            navigate("/")
        }
        console.log(isLoading)
        setIsLoading(false);
    }, [isLoading]);

    const getSubscriber = useCallback(async()=>{
        setIsLoading(true);
        const url = `/api/media_icons/subscriptions`;
        const method = "GET";
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if(response.ok){
            const data = await response.json();
            console.log(data[0])
            setSelectedPlan(data[0].selected_plan);
            setSubscriber(data[0]);
        }
        setIsLoading(false)
    },[subscriber, selectedPlan]);

    useEffect(()=> {
        checkSubscription().then(()=>{
            setIsLoading(false);
        });
        getSubscriber().then();
    }, [])

    const handlePlanChange = useCallback(async (plan) => {
        const url = `/api/media_icons/subscriptions/${subscriber.id}`;
        const method = "PATCH";
        const response = await fetch(url, {
            method,
            body: JSON.stringify({"plan": plan, "shop_id": subscriber.shop_id}),
            headers: {
                "Content-Type": "application/json"
            },
        });
        if(response.ok){
            const data = await response.json();
            const confirmationUrl = data.confirmation_url
            await window.top.location.replace(confirmationUrl);
        }
    },[subscriber]);

    const handleUnSubscribe = useCallback( async (charge_id) => {
        setUnsubscribeBtn(true);
        const url = `/api/media_icons/subscriptions/${charge_id}`;
        const method = "DELETE";
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if(response.ok){
            console.log(response.ok)
            navigate("/");
        }
    }, [subscriber, unsubscribeBtn]);

    let {
        fields: {
            owner_name,
            owner_email,
        },
    } = useForm({
        fields: {
            owner_name: useField({
                value: subscriber.shop_owner_name,
                validates: [notEmptyString("Please enter platform name")],
            }),
            owner_email: useField({
                value: subscriber.shop_owner_email,
                validates: [notEmptyString("Please enter platform url")],
            })
        },
    });


    return(
        <>
            {isLoading?
                <div className="page">
                    <div style={{display: "flex", justifyContent: "center", margin: "25%"}}>
                        <Spinner accessibilityLabel="Spinner example" size="large" />
                    </div>
                </div> :

                <Layout>
                    <Layout.Section fullWidth>
                        <TitleBar
                            title="Social Media Icon App"
                            secondaryActions={[
                                {
                                    content: "Help",
                                    onAction: null
                                },
                            ]}
                        />
                        <div><Button icon={CircleChevronLeftMinor} onClick={()=>{navigate("/dashboard")}}> Back to Dashboard</Button></div>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <div>
                        <Card sectioned>
                                <h2 className="heading" style={{fontSize:"1.3rem", margin:"0 0 3rem 0"}}>Account Owner Details</h2>
                                <Form onSubmit={null}>
                                    <FormLayout>
                                        <h2 className="heading" style={{lineHeight:0, fontSize:"1rem"}}>Name</h2>
                                        <TextField
                                            {...owner_name}
                                            label=""
                                            placeholder={"Url"}
                                            autoComplete="off"
                                        />
                                        <h2 className="heading" style={{lineHeight:0, fontSize:"1rem"}}>Email address</h2>
                                        <TextField
                                            {...owner_email}
                                            label=""
                                            placeholder={"Url"}
                                            autoComplete="off"
                                        />
                                    </FormLayout>
                                </Form>
                            </Card>
                        </div>
                    </Layout.Section>
                    <Layout.Section oneHalf></Layout.Section>
                    <Layout.Section oneHalf>
                        <Card>
                            <Card.Section>
                            <h2 className="planName">Basic Plan</h2>
                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem", verticalAlign:"middle"}}><h2  style={{fontSize: "40px"}} className="heading">$2<span style={{fontSize: "20px"}}>/month</span></h2></div>
                            </Card.Section>
                            <Card.Section>
                            <div style={{display: "inline-block"}}>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                            </div>
                            {selectedPlan === "Basic Plan" ?
                                <div style={{display: "flex", marginTop: "1rem", width: "100%"}}>
                                    <div style={{display: "flex", backgroundColor: "#c1c1c1", width: "fit-content", padding: "0 10px", borderRadius: "5px"}}>
                                        <Icon source={StatusActiveMajor} color="primary"/>
                                        <h2 className="planName" style={{color: "#008060", backgroundColor: "#c1c1c1"}}>Your Plan</h2>
                                    </div>
                                    <div style={{display: "flex", marginRight: "0", marginLeft: "auto"}}>
                                        <Button size="slim" destructive loading={unsubscribeBtn} onClick={()=>{handleUnSubscribe(subscriber.charge_id).then()}}>Unsubscribe</Button>
                                    </div>
                                </div> :

                                <div style={{width:"100%", textAlign:"center", marginTop:"1rem"}}><Button
                                    id="basicPlan"
                                    primary
                                    size="slim"
                                    loading={basicPlanBtn}
                                    onClick={async () => {
                                    setBasicPlanBtn(true);
                                    await handlePlanChange("basicPlan");
                                }}>Downgrade To Basic</Button></div>
                            }
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <Card>
                            <Card.Section>
                            <h2 className="planName">Premium Plan</h2>
                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem", verticalAlign:"middle"}}><h2  style={{fontSize: "40px"}} className="heading">$5<span style={{fontSize: "20px"}}>/month</span></h2></div>
                            </Card.Section>
                            <Card.Section>
                            <div style={{display: "inline-block"}}>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                            </div>
                            {selectedPlan === "Premium Plan" ?
                                <div style={{display: "flex", marginTop: "1rem", width: "100%"}}>
                                    <div style={{display: "flex", backgroundColor: "#c1c1c1", width: "fit-content", padding: "0 10px", borderRadius: "5px"}}>
                                        <Icon source={StatusActiveMajor} color="primary"/>
                                        <h2 className="planName" style={{color: "#008060", backgroundColor: "#c1c1c1"}}>Your Plan</h2>
                                    </div>
                                    <div style={{display: "flex", marginRight: "0", marginLeft: "auto"}}>
                                        <Button size="slim" destructive loading={unsubscribeBtn} onClick={()=>{handleUnSubscribe(subscriber.charge_id).then()}}>Unsubscribe</Button>
                                    </div>
                                </div> :

                                <div style={{width:"100%", textAlign:"center", marginTop:"1rem"}}><Button
                                    id="premiumPlan"
                                    primary
                                    size="slim"
                                    loading={premiumPlanBtn}
                                    onClick={async () => {
                                    setPremiumPlanBtn(true);
                                    await handlePlanChange("premiumPlan").then();
                                }}>Upgrade To Premium</Button></div>
                            }
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
            }
        </>
    )
}