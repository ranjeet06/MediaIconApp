import {
    Banner,
    Button,
    ButtonGroup,
    Card,
    Form,
    FormLayout,
    Heading,
    Layout, Spinner,
    Stack,
    TextField,
} from "@shopify/polaris";
import {TitleBar, Toast} from "@shopify/app-bridge-react";
import {useCallback, useEffect, useState} from "react";
import Select from "react-select";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {notEmptyString, useField, useForm} from "@shopify/react-form";
import { useNavigate } from "react-router-dom";
import {useAuthenticatedFetch} from "../hooks";
import {
    APPEARANCE_LOCATION, deleteCustomIcon, getCustomIcon, ICON,
    ICONS_TITLE, mediaIcon,
    MINIMIZATION,
    MOBILE_BEHAVIOUR,
    POSITIONS,
    SHOP
} from "./providers/iconData.jsx";
import {deleteIcon, resizeHorizontal, resizeVertical} from "../assets/index.js";
import isURL from 'validator/lib/isURL';


export default function IconsSetting(){
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showTitleBar, setShowTitleBar] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [customIcon, setCustomIcon] = useState(false);
    const [resetValue, setResetValue] = useState(false);
    const [socialMediaIconList, setSocialMediaIconList] = useState([]);
    const [updatedMediaIconList, setUpdatedMediaIconList] = useState([]);
    const [shop, setShop] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [customTitle, setCustomTitle] = useState(false);
    const [iconList, setIconList] = useState([]);
    const [iconToDelete, setIconToDelete] = useState([]);
    const [showCustomIcon, setShowCustomIcon] = useState(false);
    const [active, setActive] = useState(false);
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();

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
            const status = data.status
            if(status !== "active"){
                navigate("/")
            }
        }else {
            navigate("/")
        }

        setIsLoading(false);
    }, [isLoading]);

    /*  const checkSubscription = useCallback( async () => {
        setIsLoading(true);
        const data = await CheckSubscription(fetch);
        console.log(data.status)
        if(data.status !== "active"){
            console.log(data.status)
            navigate("/")
        }
        setIsLoading(false);
    }, [isLoading]);*/

    const scriptTag = useCallback(
        async () => {
            const url = `/api/create-script-tag`;
            const method = "GET";
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }, []);

    const list = useCallback(
        async () => {
            const url = `/api/media_icons/links`;
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setSocialMediaIconList(data);
                setUpdatedMediaIconList(data);
                setIconList(data);
            }
        }, [socialMediaIconList, updatedMediaIconList, iconList]);

    const getGeneralSettings = useCallback(
        async () => {
            const url = "/api/media_icons/configurations";
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.ok) {
                const data = await response.json();
                console.log(data)
                if (data.length === 0) {
                    const response = await fetch("/api/media_icons/configurations", {
                        method: "POST",
                        body: JSON.stringify(SHOP),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setShop(data[0]);
                    }
                } else {
                    setShop(data[0])
                }
            }
        }, [shop]);

    useEffect(() => {
        checkSubscription().then();
        getGeneralSettings().then();
        list().then();
        scriptTag().then();
        return ()=>{
            setIsLoading(false)
        }
    }, []);

    const onSubmit = useCallback(
        (body) => {
            setIsLoading(true);
            let isIconExist = false;
            updatedMediaIconList.forEach((data) => {
                if(data.icon_title === body.icon_title){
                    isIconExist = true;
                }
            });

            if(isIconExist === false){
                setUpdatedMediaIconList(updatedMediaIconList.concat(body));
                getCustomIcon(body.icon_title, body.icon);
            }
            reset()
            setShowForm(false);
            setShowTitleBar(true);
            setCustomIcon(false);
            setResetValue(false);
            setCustomTitle(false);
            setIsLoading(false);
            setShowCustomIcon(false);
            return {status: "success"};
        },
        [socialMediaIconList, updatedMediaIconList, iconList]
    );

    const onAddBtnClick = () => {
        setShowTitleBar(false);
        setShowForm(true);
    };
    const cancelBtnClick = () => {
        reset();
        setShowForm(false);
        setShowTitleBar(true);
        setCustomIcon(false);
        setResetValue(false);
        setCustomTitle(false);
        setShowCustomIcon(false);
    };

    const onUpdate = useCallback( async (body) => {
        setButtonLoading(true);
            setIsLoading(true);
            let updatedShop = {
                "position": shop.position,
                "vertical_position": shop.vertical_position,
                "horizontal_position": shop.horizontal_position,
                "shape": shop.shape,
                "icon_size": shop.icon_size,
                "app_status": shop.app_status,
                "appearance_location": shop.appearance_location,
                "minimization": !!shop.minimization,
                "mobile_behaviour": !!shop.mobile_behaviour
            }

            if(JSON.stringify(body) !== JSON.stringify(updatedShop)){
                await (async () => {
                    const url = `/api/media_icons/configurations/${shop.shop_id}`;
                    const method = "PATCH";
                    const response = await fetch(url, {
                        method,
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.ok) {
                        const response = await fetch("/api/media_icons/configurations", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            setShop(data[0]);
                        }
                    }
                })();
            }

            if (JSON.stringify(socialMediaIconList) !== JSON.stringify(updatedMediaIconList)) {
                    for (let i = 0; i < updatedMediaIconList.length; i++) {
                        if(updatedMediaIconList[i].id){
                            if (i+1 !== updatedMediaIconList[i].display_order) {
                                const url = `/api/media_icons/links/display_order/${updatedMediaIconList[i].id}`;
                                const method = "PATCH";
                                await fetch(url, {
                                    method,
                                    body: JSON.stringify({
                                        "display_order": i+1
                                    }),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            }
                            if (socialMediaIconList[i].icon_link !== updatedMediaIconList[i].icon_link || socialMediaIconList[i].icon_color !== updatedMediaIconList[i].icon_color) {
                                const url = `/api/media_icons/links/${updatedMediaIconList[i].id}`;
                                const method = "PATCH";
                                await fetch(url, {
                                    method,
                                    body: JSON.stringify({
                                        "icon_link": updatedMediaIconList[i].icon_link,
                                        "icon_color": updatedMediaIconList[i].icon_color
                                    }),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                            }
                        } else {
                            const parsedBody = {
                                "icon_title":updatedMediaIconList[i].icon_title,
                                "icon_link": updatedMediaIconList[i].icon_link,
                                "icon": updatedMediaIconList[i].icon,
                                "icon_color": updatedMediaIconList[i].icon_color,
                                "display_order": i+1
                            };
                            const url = "/api/media_icons/links";
                            const method = "POST";
                            await fetch(url, {
                                method,
                                body: JSON.stringify(parsedBody),
                                headers: {
                                    "Content-Type": "application/json"
                                },
                            });
                        }
                    }

                    const url = `/api/media_icons/links`;
                    const method = "GET";
                    const response = await fetch(url, {
                        method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSocialMediaIconList(data)
                        setUpdatedMediaIconList(data)
                        setIconList(data)
                    }
            }

            if(iconToDelete){
                for (const id of iconToDelete) {
                    await fetch(`/api/media_icons/links/${id}`, {
                        method: "DELETE",
                        headers: {"Content-Type": "application/json"},
                    });
                }

                const url = `/api/media_icons/links`;
                const method = "GET";
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSocialMediaIconList(data)
                    setUpdatedMediaIconList(data)
                    setIconList(data)
                }
            }

            setIconToDelete([]);
            setIsLoading(false);
            setActive(true);
            setButtonLoading(false)
        }
    , [shop, setShop, socialMediaIconList, updatedMediaIconList, iconList]);

    const onReset = useCallback(()=>{
        setIsLoading(true);
        resetGeneralSetting();
        setSocialMediaIconList(iconList);
        setUpdatedMediaIconList(iconList);
        reset();
        setCustomIcon(false);
        setResetValue(false)
        setCustomTitle(false);
        setShowCustomIcon(false);
        setIconToDelete([]);
        setIsLoading(false);
    }, [socialMediaIconList, updatedMediaIconList, iconList]);

    let {
        fields: {
            position,
            vertical_position,
            horizontal_position,
            shape,
            icon_size,
            app_status,
            appearance_location,
            minimization,
            mobile_behaviour,
        },
        submit: update,
        reset: resetGeneralSetting
    } = useForm({
        fields: {
            position: useField(shop?.position || 'Top Right'),
            vertical_position: useField(shop?.vertical_position || 0 ),
            horizontal_position : useField(shop?.horizontal_position || 0),
            shape: useField(shop?.shape || 'circle'),
            icon_size: useField(shop?.icon_size || 50),
            app_status: useField(shop?.app_status || 'App enabled'),
            appearance_location: useField(shop?.appearance_location || 'entireStore'),
            minimization: useField(!!shop?.minimization || false),
            mobile_behaviour: useField(!!shop?.mobile_behaviour || true),
        },
        onSubmit: onUpdate,
    });

    const linkField = useField({
        value: ICON.icon_link || '',
        validates: [
            value => {
                if ( !isURL(value)) {
                    return 'Please enter a valid URL, i.e., "https://google.com"';
                }
            },
        ],
    }, []);

    let {
        fields: {
            icon_title,
            icon_link,
            icon,
            icon_color,
        },
        reset,
        submit,
    } = useForm({
        fields: {
            icon_title: useField({
                value: ICON?.icon_title || "",
                validates: [notEmptyString("Please enter platform name")],
            }),
            icon_link: linkField,
            icon: useField({
                value: ICON?.icon || ""
            }),
            icon_color: useField({
                value: ICON?.icon_color || "#EFE6E6"
            }),
        },
        onSubmit,
    });

    const handleSelectTitleChange = useCallback((value) => {
        setResetValue(true)
        if(value.value === "Custom Icon"){
            setCustomTitle(true);
            setCustomIcon(true);
        }else {
            icon_title.onChange(value.value);
            setCustomIcon(false);
        }
    }, []);

    const handleColor = useCallback((e) => { icon_color.onChange(e.target.value) }, []);

    const handleColorAndUrlChange = (id, field, value) => {
        const newArray = updatedMediaIconList.map((item, index) => {
            if (index === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setUpdatedMediaIconList(newArray);
    }

    const handleFileChange = useCallback( (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            icon.onChange(reader.result);
        };
        setShowCustomIcon(true);
    }, []);

    function handleChange() {
        if (app_status.value === "App enabled") {
            app_status.onChange("App disabled")
        } else {
            app_status.onChange("App enabled")
        }
    }


    const handleRemove = (index) => {
        setIconToDelete(iconToDelete.concat(updatedMediaIconList[index].id));
        deleteCustomIcon(updatedMediaIconList[index].icon_title)
        const newArray = [...updatedMediaIconList];
        newArray.splice(index, 1);
        setUpdatedMediaIconList(newArray);
    };

    const handleDrop = useCallback ( (droppedItem) => {
        setIsLoading(true);
        if (!droppedItem.destination) return;
        setIconList(socialMediaIconList);
        let updatedList = [...updatedMediaIconList];
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        setUpdatedMediaIconList(updatedList);
        setIsLoading(false);
    }, [socialMediaIconList, updatedMediaIconList, iconList, isLoading]);

    const onAccountSettingClick = () => {
        navigate('/account-management');
    }


    const toastMarkup = active ? (
        <Toast content="Changes saved! Please wait up to 30 seconds for updates to appear in your store." onDismiss={()=>{setActive(false)}} />
    ) : null;

    return(
        <>
        {isLoading?
                    <div className="page">
                        <div style={{display: "flex", justifyContent: "center", margin: "25%"}}>
                            <Spinner accessibilityLabel="Spinner example" size="large" />
                        </div>
                    </div>
                 :

                <Layout>
                        <Form onSubmit={null}>
                            <Layout.Section>
                                <TitleBar title="Social Media Icon App"
                                          primaryAction={{
                                              content: "Save",
                                              onAction: update,
                                              disabled: !showTitleBar,
                                              loading: buttonLoading
                                          }}
                                          secondaryActions={[
                                              {
                                                  content: "Reset",
                                                  onAction: onReset,
                                              },
                                              {
                                                  content: "Account Settings",
                                                  onAction: onAccountSettingClick
                                              },
                                          ]}
                                />
                            </Layout.Section>
                        </Form>

                        <Layout.Section fullWidth>
                            <h2 className="heading" style={{fontSize:"var(--p-font-size-8)"}}>Social bar - social media icons</h2>
                            <Banner title="About the app" status="info" >
                                <p>This app adds social media icons of your choice.</p>
                            </Banner>
                        </Layout.Section>

                        <Layout.Section oneHalf>
                            <Card sectioned>
                                <h2 className="heading">General Setting</h2>
                                <Card sectioned>
                                    <Heading>{app_status.value}</Heading>
                                    <label className="switch">
                                        <input type="checkbox" checked={app_status.value === "App enabled"} onChange={handleChange}/>
                                        <span className="slider1 round"></span>
                                    </label>
                                </Card>
                                <Card sectioned>
                                    <Stack
                                        wrap={false}
                                        spacing="extraTight"
                                        distribution="trailing"
                                        alignment="center"
                                    >
                                        <Stack.Item fill>
                                            <Heading>Bar's Appearance Location</Heading>
                                        </Stack.Item>
                                    </Stack>
                                    <Select
                                        options={APPEARANCE_LOCATION}
                                        onChange={(value)=>{appearance_location.onChange(value.value);}}
                                        value={{value: appearance_location.value, label: (appearance_location.value === "entireStore"?"Show the bar in the entire store":"Show the bar just in the home page")}}
                                    />
                                </Card>
                                <Card sectioned>
                                    <Stack
                                        wrap={false}
                                        spacing="extraTight"
                                        distribution="trailing"
                                        alignment="center"
                                    >
                                        <Stack.Item fill>
                                            <Heading>Bar Minimization</Heading>
                                        </Stack.Item>
                                    </Stack>
                                    <Select
                                        options={MINIMIZATION}
                                        onChange={(value)=>{minimization.onChange(value.value);}}
                                        value={{value: !!minimization.value, label: (minimization.value?"Allow customers to minimize the bar":"Do not allow customers to minimize the bar")}}
                                    />
                                </Card>
                                <Card sectioned>
                                    <Stack
                                        wrap={false}
                                        spacing="extraTight"
                                        distribution="trailing"
                                        alignment="center"
                                    >
                                        <Stack.Item fill>
                                            <Heading>Mobile Behaviour</Heading>
                                        </Stack.Item>
                                    </Stack>
                                    <Select
                                        options={MOBILE_BEHAVIOUR}
                                        onChange={(value)=>{mobile_behaviour.onChange(value.value);}}
                                        value={{value: !!mobile_behaviour.value, label: (mobile_behaviour.value?"Show on mobile device":"Don't show on mobile device")}}
                                    />
                                </Card>
                                <Card sectioned>
                                    <Stack
                                        wrap={false}
                                        spacing="extraTight"
                                        distribution="trailing"
                                        alignment="center"
                                    >
                                        <Stack.Item fill>
                                            <Heading>Bar's Positioning</Heading>
                                        </Stack.Item>
                                    </Stack>
                                    <div style={{zIndex: 2}}>
                                        <Select
                                            options={POSITIONS}
                                            onChange={(value)=>{position.onChange(value.value);}}
                                            value={{value: position.value, label: position.value}}
                                        />
                                    </div>
                                    <div className="barPosition">
                                        <div className="vertical">
                                            <h2 style={{fontWeight:"550"}}>Bar Vertical Position</h2>
                                            <img src={resizeVertical} alt=''/>
                                            <div style={{marginTop:"1em"}}>
                                                <input type="range" min="0" max="50" value={vertical_position.value} onChange={(e)=>{vertical_position.onChange(e.target.value)}}/>
                                            </div>
                                            <div style={{width:"55%", margin:"auto"}}>
                                                <TextField
                                                    label={""}
                                                    autoComplete={"off"}
                                                    type="number"
                                                    min={0}
                                                    max={50}
                                                    value={vertical_position.value}
                                                    suffix={"%"}
                                                    onChange={(value)=>{vertical_position.onChange(value)}}
                                                />
                                            </div>
                                        </div>
                                        <div className="horizontal">
                                            <h2 style={{fontWeight:"550"}}>Bar Horizontal Position</h2>
                                            <img src={resizeHorizontal} alt=''/>
                                            <div style={{marginTop:"1em"}}>
                                                <input type="range" min="0" max="50" value={horizontal_position.value} onChange={(e)=>{horizontal_position.onChange(e.target.value)}}/>
                                            </div>
                                            <div style={{width:"55%", margin:"auto"}}>
                                                <TextField
                                                    label={""}
                                                    autoComplete={"off"}
                                                    type="number"
                                                    min={0}
                                                    max={50}
                                                    value={horizontal_position.value}
                                                    suffix={"%"}
                                                    onChange={(value)=>{horizontal_position.onChange(value)}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <Card title={"Bar Icon's Shape"}>
                                    <div className="shape">
                                        <div className="inputShape">
                                            <input
                                                type="checkbox"
                                                checked={shape.value === "circle"}
                                                onChange={(e)=>{shape.onChange(e.target.id)}}
                                                id={"circle"}
                                            />
                                        </div>
                                        <div id={"circle"} className={shape.value === "circle" ? "circleShape": "circle" } onClick={(e)=>{shape.onChange(e.target.id)}}/>
                                        <div style={{marginLeft: "40px", display: "inline-block"}}>
                                            <div className="inputShape">
                                                <input
                                                    type="checkbox"
                                                    checked={shape.value === "rectangle"}
                                                    onChange={(e)=>{shape.onChange(e.target.id)}}
                                                    id={"rectangle"}
                                                />
                                            </div>
                                            <div id={"rectangle"} className={shape.value === "rectangle" ? "rectangleShape" : "rectangle"} onClick={(e)=>{shape.onChange(e.target.id)}}/>
                                        </div>
                                    </div>

                                    <div style={{width:"100%", margin:"auto 1em"}}>
                                        <h2 style={{marginTop:"2em", marginBottom:"1em", fontWeight:"550"}}>Social Media Icon Size</h2>
                                        <div style={{display:"flex", alignItems:"baseline", width:"100%"}}>
                                            <div style={{width:"70%"}}>
                                                <input style={{marginBottom:"2em", width:"100%"}} type="range" min="1" max="70" value={icon_size.value} onChange={(e)=>{icon_size.onChange(e.target.value)}}/>
                                            </div>
                                            <div style={{width:"7em", margin:"0 2em 0 2em" }}>
                                                <TextField
                                                    label={""}
                                                    autoComplete={"off"}
                                                    type="number"
                                                    min={1}
                                                    max={70}
                                                    value={icon_size.value}
                                                    suffix={"px"}
                                                    onChange={(value)=>{icon_size.onChange(value)}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Card>
                        </Layout.Section>

                        <Layout.Section oneHalf>
                            <Card sectioned>
                                <div style={{display:"flex", alignItems:"baseline", width:"98%"}}>
                                    <h2 className="heading">Social media setting</h2>
                                    <div style={{marginLeft:"auto", marginRight:"0"}}><Button plain><span onClick={onAddBtnClick}>Add Social Media icon link</span></Button></div>

                                </div>
                                <p>The icon in your store will appear in this order. Drag <b>(&#10133;)</b> and arrange them as you like.</p>

                                {
                                    showForm ? (
                                        <Card sectioned>
                                            <Card>
                                                <Form onSubmit={null}>
                                                    <FormLayout>
                                                        <Select
                                                            className="selectTitle"
                                                            options={ICONS_TITLE}
                                                            onChange={handleSelectTitleChange}
                                                            value={resetValue?(customTitle?{value:icon_title.value, label:"Custom Icon"}:{value:icon_title.value, label:icon_title.value}):null}
                                                        />
                                                        {customIcon?
                                                            <TextField
                                                                {...icon_title}
                                                                placeholder={"Title"}
                                                                autoComplete="off"
                                                            /> : null
                                                        }
                                                        <TextField
                                                            {...icon_link}
                                                            placeholder={"Url"}
                                                            autoComplete="off"
                                                        />
                                                        {customIcon?
                                                            <input type="file"  accept="image/*" onChange={handleFileChange} name={"icon"} style={{width:"200px"}}/> : null
                                                        }
                                                        <div className="selectColorText" style={{display:"flex"}}>Icon's colour : {" "}
                                                            <div className="selectColor">
                                                                <input style={{width:"30px", height:"30px"}} type="color" name="favColor" value={icon_color.value} onChange={handleColor} />
                                                            </div>
                                                            {showCustomIcon?
                                                                <div style={{margin: "0 auto"}}>
                                                                    icon :
                                                                    <img style={{width: "30px", height: "30px", margin: "0 0 10px 5px"}} src={icon.value} alt={''}/>
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                        <div style={{width:"100%", display:"grid"}}>
                                                            <div style={{marginLeft:"auto", marginRight:"auto", marginBottom:"5px"}}>
                                                                <ButtonGroup spacing>
                                                                    <Button onClick={cancelBtnClick}>Cancel</Button>
                                                                    <Button primary onClick={submit}>Submit</Button>
                                                                </ButtonGroup>
                                                            </div>
                                                        </div>
                                                    </FormLayout>
                                                </Form>
                                            </Card>
                                        </Card>
                                    ) : null
                                }
                                <DragDropContext onDragEnd={handleDrop}>
                                    <Droppable droppableId="list-container">
                                        {(provided) => (
                                            <div
                                                className="list-container a"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {updatedMediaIconList.map((data, index) => (
                                                    <Draggable key={data.icon_title} draggableId={data.icon_title} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                className="item-container"
                                                                ref={provided.innerRef}
                                                                {...provided.dragHandleProps}
                                                                {...provided.draggableProps}
                                                            >

                                                                <div id="list">
                                                                    <Stack
                                                                        wrap={false}
                                                                        spacing="extraTight"
                                                                        distribution="trailing"
                                                                        alignment="center"
                                                                    >
                                                                        <Stack.Item fill>
                                                                            <Heading>{data.icon_title}</Heading>
                                                                        </Stack.Item>

                                                                        <Stack.Item>
                                                                            <Button plain onClick={()=>handleRemove(index)} >
                                                                                <img style={{height:"18px", marginRight:"5px"}} id={data.id} src={deleteIcon} title={"delete"} alt=""/>
                                                                            </Button>
                                                                        </Stack.Item>
                                                                    </Stack>
                                                                    <TextField
                                                                        value={data.icon_link}
                                                                        placeholder={data.icon_link}
                                                                        prefix={mediaIcon(data.icon_title)!==undefined?<img src={mediaIcon(data.icon_title)}  alt='' style={{width:"22px"}}/>:<img src={data.icon}  alt='' style={{width:"22px"}}/>}
                                                                        autoComplete="off"
                                                                        label="url"
                                                                        labelHidden
                                                                        onChange={value => handleColorAndUrlChange(index, "icon_link", value)}
                                                                    />
                                                                    <div className="selectColorText">Icon's colour : </div>
                                                                    <div className="selectColor">
                                                                        <input
                                                                            style={{width:"30px"}}
                                                                            type="color"
                                                                            id={data.id}
                                                                            name="favColor"
                                                                            value={data.icon_color}
                                                                            onChange={e => handleColorAndUrlChange(index, "icon_color", e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Card>
                        </Layout.Section>
                    {toastMarkup}
                    </Layout>
        }
        </>
    );
}