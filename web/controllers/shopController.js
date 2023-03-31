import {ShopsModel} from "../models/storeModels/shopsModel.js";
import { v4 as uuid } from 'uuid';
import {getStoreDetails, subscribeWebhook, createScriptTag} from "../helpers/stores.js";
import {WebhooksModel} from "../models/storeModels/webhooksModel.js";


/*--------------------------------------------------------------------------------------------------------------*/
    /* Action on stores endpoints */

export async function createShop(req, res) {
   const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
   if(shop.length === 0){
       try {
           const response = await ShopsModel.createShop({
               ...(await getStoreDetails(req, res)),
               id: uuid()
           });
           res.status(200).send(response);
       }catch (error){
           res.status(500).send(error);
       }
   }else {
       res.status(200).send(shop);
   }
}

/*-------------------------------------------------------------------------------------------------------------*/
    /* Action on webhooks subscription endpoints */

export const webhookTopic = ['app_uninstalled', 'shop_update', 'app_subscription_update'];
export const webhookProperties = {
    shop_update: {
        topic: 'shop/update',
        address: `${process.env.HOST}/api/webhooks/shop_update`
    },
    app_uninstalled: {
        topic: 'app/uninstalled',
        address: `${process.env.HOST}/api/webhooks/app_uninstalled`
    },
    app_subscription_update: {
        topic: 'app_subscriptions/update',
        address: `${process.env.HOST}/api/webhooks/app_subscription_update`
    },
}

export async function getWebhookProperties(topic){
    return webhookProperties[topic];
}

export async function subscribeRequiredWebhook(req, res) {
    const shop = await ShopsModel.readShop(`https://${res.locals.shopify.session.shop}`);
    if(shop.length !== 0){
        try{
            for (const topic of webhookTopic) {
                const webhookProperties = await getWebhookProperties(topic)
                const webhookBody = {
                    "webhook":
                        {
                            "address": webhookProperties.address,
                            "topic": webhookProperties.topic,
                            "format": "json"
                        }
                }
                const response = await subscribeWebhook(req, res, webhookBody);
                if(!response.webhookStatus){
                    console.log("*************************************")
                    console.log(response)
                    const webhook = await WebhooksModel.readWebhook(shop[0].shop_id, webhookProperties.topic);
                    if(webhook.length === 0){
                        await WebhooksModel.createWebhook({
                            shop_id: shop[0].shop_id,
                            topic: response.topic,
                            x_shopify_webhook_id: response.x_shopify_webhook_id
                        });
                    }
                    console.log(webhook)
                }
            }
            res.status(201).send();
        }catch (error){
            res.status(500).send(error);
        }
    }
}

export async function scriptTag(req, res){
    try {
        const response = await createScriptTag(req, res);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


