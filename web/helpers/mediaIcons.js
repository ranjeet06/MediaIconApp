import {ShopsModel} from "../models/storeModels/shopsModel.js";
import {IconsConfigurationsModel} from "../models/iconsModels/iconsConfigurationsModel.js";
import fs from "fs";
import {IconsLinksModel} from "../models/iconsModels/iconsLinksModels.js";

export async function parseConfigurationsBody(req) {
    return {
        position: req.body.position,
        vertical_position: req.body.vertical_position,
        horizontal_position: req.body.horizontal_position,
        shape: req.body.shape,
        icon_size: req.body.icon_size,
        app_status : req.body.app_status,
        appearance_location: req.body.appearance_location,
        minimization: req.body.minimization,
        mobile_behaviour: req.body.mobile_behaviour,
    };
}

export async function parseIconLinkBody(req){
    return {
        icon_title: req.body.icon_title,
        icon_link: req.body.icon_link,
        icon_color: req.body.icon_color,
        display_order: req.body.display_order
    };
}

export async function getConfigurationsOr404(req, res){
    try {
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        const response = await IconsConfigurationsModel.readIconsConfigurations(shop[0].shop_id);
        if ( response === undefined ) {
            res.status(404).send();
        } else {
            return response;
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getIconLinkOr404(req, res) {
    const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
    try {
        const response = await IconsLinksModel.getIconLink(req.params.id, shop[0].shop_id);
        if ( response === undefined ) {
            res.status(404).send();
        } else {
            return response[0];
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    return undefined;
}

export async function getIconLink(req, res) {
    const icon = req.body.icon;
    if (icon.value === "") {
        return `/images/${req.body.icon_title}.png`;
    } else if (icon.value !== "") {
        const base64Data = icon.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFile(`frontend/public/images/custom/${res.locals.shopify.session.shop + '-' + req.body.icon_title}.png`, buffer, (err) => {
            if (err) {
                res.status(500).send(err.message);
            }
        });
        return `/images/custom/${res.locals.shopify.session.shop + '-' + req.body.icon_title}.png`;
    }
}