import {validationResult} from "express-validator";
import {IconsConfigurationsModel} from "../../models/iconsModels/iconsConfigurationsModel.js";
import {ShopsModel} from "../../models/storeModels/shopsModel.js";
import {getConfigurationsOr404, parseConfigurationsBody} from "../../helpers/mediaIcons.js";

export async function setConfigurations(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body)
    try {
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        const id = await IconsConfigurationsModel.setIconsConfiguration({
            ...(await parseConfigurationsBody(req)),
            shop_id: shop[0].shop_id
        });
        res.status(201).send(id);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateConfigurations(req, res){
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const configurations = await getConfigurationsOr404(req, res);
    if (configurations) {
        try {
            const response = await IconsConfigurationsModel.updateIconsConfiguration({
                ...(await parseConfigurationsBody(req)),
                shop_id: req.params.id
            });
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export async function getConfigurations(req, res){
    try {
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        const rawCodeData = await IconsConfigurationsModel.readIconsConfigurations(shop[0].shop_id);
        res.status(200).send(rawCodeData);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteConfiguration(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const rawCodeData = await IconsConfigurationsModel.deleteIconsConfigurations(req.params.id);
        res.status(200).send(rawCodeData);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


/*-------------------------------------------------------------------------------------------------------*/

/* action on public endpoints */

export async function getConfigurationForClient(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const shop_url = req.query.shop_url
    try {
        const shop = await ShopsModel.readShop(shop_url);
        const rawCodeData = await IconsConfigurationsModel.getIconsConfigurations(shop[0].shop_id);
        res.status(200).send(rawCodeData);
    } catch (error) {
        res.status(500).send(error.message);
    }
}