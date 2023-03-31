import getRawBody from "raw-body";
import {verifyWebhook} from "../helpers/stores.js";
import {WebhooksModel} from "../models/storeModels/webhooksModel.js";
import {ShopsModel} from "../models/storeModels/shopsModel.js";
import {SubscriptionsModel} from "../models/storeModels/subscriptionsModel.js";
import {IconsConfigurationsModel} from "../models/iconsModels/iconsConfigurationsModel.js";
import {IconsLinksModel} from "../models/iconsModels/iconsLinksModels.js";

export async function appUninstalled(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const body = JSON.parse(data);
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const XShopifyWebhookId = req.headers['x-shopify-webhook-id'];
    const verify = verifyWebhook(data, hmacHeader);
    console.log(verify);
    if(verify){
        console.log("webhook verified.");
        console.log(body.id)
        //await WebhooksModel.deleteWebhook(66853306688);
        const webhook = await WebhooksModel.readWebhook(body.id, 'app/uninstalled');
        const webhook1 = await WebhooksModel.readWebhook(66853306688, 'shop/update');
        console.log(webhook)
        console.log(webhook1)
        if (webhook.length !== 0){
            console.log(webhook[0].x_shopify_webhook_id !== XShopifyWebhookId)
            if(webhook[0].x_shopify_webhook_id !== XShopifyWebhookId){
                await WebhooksModel.deleteWebhook(body.id);
                await ShopsModel.deleteShop(body.id);
                await SubscriptionsModel.deleteSubscription(body.id);
                await IconsConfigurationsModel.deleteIconsConfigurations(body.id);
                await IconsLinksModel.deleteAllIconLinkOfShop(body.id);
            }
        }
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}

export async function shopUpdate(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const body = JSON.parse(data);
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const verify = verifyWebhook(data, hmacHeader);
    if(verify){
        console.log("webhook verified.");
        const webhook = await WebhooksModel.readWebhook(body.id, req.headers['x-shopify-topic']);
        if (webhook.length !== 0){
            if(webhook[0].x_shopify_webhook_id !== req.headers['x-shopify-webhook-id']){

                await WebhooksModel.updateWebhook({
                    shop_id: body.id,
                    topic: req.headers['x-shopify-topic'],
                    x_shopify_webhook_id: req.headers['x-shopify-webhook-id']
                });
                await ShopsModel.updateShop({
                    shop_url: `https://${req.headers['x-shopify-shop-domain']}`,
                    shop_id: body.id,
                    shop_owner_name: body.shop_owner,
                    shop_owner_email: body.email
                });
            }
        }
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}

export async function updateSubscriptionsPlan(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const body = JSON.parse(data);
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const verify = verifyWebhook(data, hmacHeader);
    if(verify){
        console.log("webhook verified.");
        console.log(body);
        if(body.app_subscription.status === 'ACTIVE'){
            const chargeIdStr = body.app_subscription.admin_graphql_api_id;
            const chargeID = chargeIdStr.match(/\d+/g);
            const shopIdStr = body.app_subscription.admin_graphql_api_shop_id;
            const shopID = shopIdStr.match(/\d+/g);
            console.log(chargeID[0], "***********************", shopID[0]);
            await SubscriptionsModel.updateSubscription({
                shop_id: shopID[0],
                charge_id: chargeID[0],
                selected_plan: body.app_subscription.name
            })
        }
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}

export async function customersDataRequest(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const verify = verifyWebhook(data, hmacHeader);
    if(verify){
        console.log("webhook verified.");
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}

export async function customersRedact(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const verify = verifyWebhook(data, hmacHeader);
    if(verify){
        console.log("webhook verified.");
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}

export async function shopRedact(req, res){
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const verify = verifyWebhook(data, hmacHeader);
    if(verify){
        console.log("webhook verified.");
        res.status(200).send();
    }else {
        console.log("webhook not verified.");
        res.status(401).send();
    }
}
