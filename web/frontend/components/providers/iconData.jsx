import {facebook, instagram, linkedin, pinterest, twitter, whatsapp, youtube} from "../../assets/index.js";

export const SHOP = {
    "position": "Bottom Right",
    "vertical_position": 0,
    "horizontal_position": 0,
    "shape": "circle",
    "icon_size": 40,
    "app_status": "App enabled",
    "appearance_location": "entireStore",
    "minimization": false,
    "mobile_behaviour": true
}

export const ICON = {
    icon_title: "",
    icon_link: "",
    icon: "",
    icon_color: '#EFE6E6',
}

export const ICONS_TITLE = [
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Youtube', value: 'Youtube' },
    { label: 'LinkedIn', value: 'LinkedIn'},
    { label: 'Pinterest', value: 'Pinterest'},
    { label: 'Whatsapp', value: 'Whatsapp' },
    { label: 'Custom Icon', value: 'Custom Icon' },
];

const icon = {
    Facebook: facebook,
    Instagram: instagram,
    Twitter: twitter,
    Youtube: youtube,
    LinkedIn: linkedin,
    Pinterest: pinterest,
    Whatsapp: whatsapp
};

const customIconList = {};

export const getCustomIcon = (title, icon) => {
    customIconList[title] = icon;
}

export const mediaIcon = (title) => {
    if(icon[title]){
        return icon[title]
    }

    return customIconList[title]
};

export const deleteCustomIcon = (title) => {
    delete customIconList[title];
}

export const POSITIONS = [
    {value: 'Top Left', label: 'Top Left'},
    {value: 'Top Right', label: 'Top Right'},
    {value: 'Bottom Left', label: 'Bottom Left'},
    {value: 'Bottom Right', label: 'Bottom Right'}
];

export const APPEARANCE_LOCATION = [
    {value: 'entireStore', label: 'Show the bar in the entire store'},
    {value: 'homePage', label: 'Show the bar just in the home page'}
];

export const MINIMIZATION = [
    {value: false, label: 'Do not allow customers to minimize the bar'},
    {value: true, label: 'Allow customers to minimize the bar'}
];

export const MOBILE_BEHAVIOUR = [
    {value: true, label:"Show on mobile device"},
    {value: false, label: "Don't show on mobile device"}
];