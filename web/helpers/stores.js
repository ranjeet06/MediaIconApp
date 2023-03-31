import fetch from "node-fetch";
import crypto from "crypto";

export async function getStoreDetails(req, res){
    const shop = res.locals.shopify.session.shop;
    const accessToken = res.locals.shopify.session.accessToken;
    const url = `https://${shop}/admin/api/2023-01/shop.json`;
    const shopifyHeader = (token) => ({ 'X-Shopify-Access-Token': token });

    const shopDetail = await fetch(url, {
        method: "GET",
        headers: shopifyHeader(accessToken)
    });
    if(shopDetail.ok){
        const data = await shopDetail.json();
        return {
            shop_url: `https://${data.shop.domain}`,
            shop_id: data.shop.id,
            shop_owner_name: data.shop.shop_owner,
            shop_owner_email: data.shop.email
        }
    }
}

export async function subscribeWebhook(req, res, webhookBody) {
    const shop = res.locals.shopify.session.shop;
    const accessToken = res.locals.shopify.session.accessToken;
    const url = `https://${shop}/admin/api/2023-01/webhooks.json`;
    const shopifyHeader = (token) => ({ 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token });

    let webhookExist = false;

    const getWebhooks = await fetch(url, {
        method: "GET",
        headers: shopifyHeader(accessToken)
    });
    if(getWebhooks.ok){
        const data = await getWebhooks.json();
        data.webhooks.map((webhook) => {
            if(webhook.address === webhookBody.webhook.address && webhook.topic === webhookBody.webhook.topic) {
                webhookExist = true;
            }
        });
    }

    if(!webhookExist) {
        const webhookSubscription = await fetch(url, {
            method: "POST",
            body: JSON.stringify(webhookBody),
            headers: shopifyHeader(accessToken)
        });
        if(webhookSubscription.ok){
            const data = await webhookSubscription.json();
            return {
                webhookStatus: false,
                topic: data.webhook.topic,
                x_shopify_webhook_id: "0"
            }
        }
    } else {
        return {webhookStatus: true};
    }
}

export function verifyWebhook(data, hmacHeader){
    const hmac = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(data, "utf8").digest('base64');
    return  crypto.timingSafeEqual(
        Buffer.from(hmac),
        Buffer.from(hmacHeader, 'utf-8')
    );
}

export async function createScriptTag(req, res) {
    const accessToken = res.locals.shopify.session.accessToken;
    console.log(accessToken)
    const shop = res.locals.shopify.session.shop;
    const host = process.env.HOST
    const url = `https://${shop}/admin/api/2023-01/script_tags.json`;
    const src = `${host}/script.js`;

    let scriptTagExist = false;

    const shopifyHeader = (token) => ({
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
    });

    const scriptTagBody = JSON.stringify({
        script_tag: {
            event: 'onload',
            src
        },
    });

    const getScriptTags = await fetch(url, {
        method: "GET",
        headers: shopifyHeader(accessToken)
    });
    if(getScriptTags.ok){
        const data = await getScriptTags.json();
        data.script_tags.map((script) => {
            if(script.src === src) {
                scriptTagExist = true;
            }
        });
    }

    if(!scriptTagExist) {
        const response = await fetch(url, {
            method: "POST",
            body : scriptTagBody,
            headers: shopifyHeader(accessToken)
        });
        if(response.ok){
            return await response.json()
        }

    } else {
        return JSON.stringify({scriptTagStatus: true});
    }
}