import {validationResult} from "express-validator";
import {ShopsModel} from "../../models/storeModels/shopsModel.js";
import {IconsLinksModel} from "../../models/iconsModels/iconsLinksModels.js";
import {getIconLink, getIconLinkOr404, parseIconLinkBody} from "../../helpers/mediaIcons.js";
import fs from "fs";

export async function createLinks(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
    try {
        const id = await IconsLinksModel.createIconLink({
            ...(await parseIconLinkBody(req)),
            shop_id: shop[0].shop_id,
            icon: (await getIconLink(req, res))
        });
        res.status(201).send(id);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getLinks(req, res){
    const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
    try {
        const data = await IconsLinksModel.getIconsLinksList(shop[0].shop_id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateLink(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const link = await getIconLinkOr404(req, res);
    if (link) {
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        try {
            const response = await IconsLinksModel.updateIconLink({
                ...(await parseIconLinkBody(req)),
                id: req.params.id,
                shop_id: shop[0].shop_id
            });
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}

export async function updateDisplayOrder(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const link = await getIconLinkOr404(req, res);
    if (link) {
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        try {
            const response = await IconsLinksModel.updateIconsLinksDisplayOrder({
                ...(await parseIconLinkBody(req)),
                id: req.params.id,
                shop_id: shop[0].shop_id
            });
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}

export async function deleteLink(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const link = await getIconLinkOr404(req, res);
    console.log(link)
    if(link){
        const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
        fs.readFile(`frontend/public/images/custom/${res.locals.shopify.session.shop + '-' + link.icon_title}.png`, 'utf8', async (err, data) => {
            if (data) {
                fs.unlink(`frontend/public/images/custom/${res.locals.shopify.session.shop + '-' + link.icon_title}.png`, (err) => {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                });
            } else if(err.code !== "ENOENT"){
                res.status(500).send(err);
            }
        });

        await IconsLinksModel.deleteIconLink(req.params.id, shop[0].shop_id);
        res.status(200).send();
    }
}

/*-------------------------------------------------------------------------------------------------*/

     /* action on public endpoints */

export async function getIconsLinkForClient(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const shop_url = req.query.shop_url
    try {
        const shop = await ShopsModel.readShop(shop_url);
        const rawCodeData = await IconsLinksModel.getIcons(shop[0].shop_id);
        res.status(200).send(rawCodeData);
    } catch (error) {
        res.status(500).send(error.message);
    }
}