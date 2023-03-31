import {
    Button,
    Layout, Card, Banner, Icon, Spinner
} from "@shopify/polaris";
import {CircleTickMinor} from '@shopify/polaris-icons';
import {useCallback, useEffect, useState} from "react";
import {useAuthenticatedFetch} from "../hooks";
import {useNavigate} from "react-router-dom";

export default function SubscriptionPlans(){

    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [basicPlanBtn, setBasicPlanBtn] = useState(false);
    const [premiumPlanBtn, setPremiumPlanBtn] = useState(false);

    const store = useCallback(
        async () => {
            setIsLoading(true);
            const url = `/api/stores`;
            const method = "POST";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                webhook().then();
                await checkSubscription().then();
            }
            console.log(isLoading)
            setIsLoading(false);
        }, [isLoading]);
    const webhook = useCallback(
        async () => {
            setIsLoading(true);
            const url = `/api/stores/webhooks/subscribe`;
            const method = "POST";
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            setIsLoading(false)
        }, [isLoading]);

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
            console.log(data)
            if(data.status === "active"){
                navigate("/dashboard")
            }
        }
        setIsLoading(false);
    }, [isLoading]);

    useEffect( () => {
        store().then();
        return ()=>{
            setIsLoading(false)
        }
    }, [])

    const handleClick = useCallback(async (plan) => {
        const url = `/api/media_icons/subscriptions`;
        const method = "POST";
        const response = await fetch(url, {
            method,
            body: JSON.stringify({"plan": plan}),
            headers: {
                "Content-Type": "application/json"
            },
        });
        if(response.ok){
            const data = await response.json();
            const confirmationUrl = data.confirmation_url;
            window.top.location.replace(confirmationUrl);
        }
    },[]);

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
                        <Banner
                            title="Select Your Plan and Start Enjoying Our Service"
                            status="info"
                        >
                            <p>Choose our Basic Plan for essential features or upgrade to our Premium Plan for advanced features and benefits.</p>
                        </Banner>
                    </Layout.Section>

                    <Layout.Section oneHalf>
                        <Card sectioned>
                            <h2 className="planName">Basic Plan</h2>
                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem", verticalAlign:"middle"}}><h2  style={{fontSize: "40px"}} className="heading">$2<span style={{fontSize: "20px"}}>/month</span></h2></div>

                            <div style={{display: "inline-block"}}>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                            </div>

                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem"}}><Button
                                id="basicPlan"
                                primary
                                size="large"
                                loading={basicPlanBtn}
                                onClick={async () => {
                                setBasicPlanBtn(true);
                                await handleClick("basicPlan").then();
                            }}>Choose Plan</Button></div>

                        </Card>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <Card sectioned>
                            <h2 className="planName">Premium Plan</h2>
                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem", verticalAlign:"middle"}}><h2  style={{fontSize: "40px"}} className="heading">$5<span style={{fontSize: "20px"}}>/month</span></h2></div>

                            <div style={{display: "inline-block"}}>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                                <p className="listItem"><Icon source={CircleTickMinor} color="primary"/>Add social media icon to your store.</p>
                            </div>
                            <div style={{width:"100%", textAlign:"center", marginTop:"1rem"}}><Button
                                id="premiumPlan"
                                primary
                                size="large"
                                loading={premiumPlanBtn}
                                onClick={async () => {
                                setPremiumPlanBtn(true);
                                await handleClick("premiumPlan").then();
                            }}>Choose Plan</Button></div>
                        </Card>
                    </Layout.Section>
                </Layout>
            }
        </>
    )
}