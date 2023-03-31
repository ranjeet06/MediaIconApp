import {validationResult} from "express-validator";
import {checkAppSubscription, createSubscriberPlan, unsubscribePlan} from "../helpers/subscriptions.js";
import {ShopsModel} from "../models/storeModels/shopsModel.js";
import {SubscriptionsModel} from "../models/storeModels/subscriptionsModel.js";


/*-------------------------------------------------------------------------------------------------------------*/
    /* Action on app subscriptions endpoints */

export async function createSubscriptions(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const recurringCharge = await createSubscriberPlan(req, res);
    if(recurringCharge){
        const shop_url = `https://${res.locals.shopify.session.shop}`;
        const shop = await ShopsModel.readShop(shop_url);
        await SubscriptionsModel.createSubscription({
            shop_id: shop[0].shop_id,
            charge_id: recurringCharge.id,
            selected_plan: recurringCharge.name
        });
        res.status(200).send(recurringCharge);
    }else {
        res.status(500).send(recurringCharge);
    }
}

export async function updateSubscriptions(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const recurringCharge = await createSubscriberPlan(req, res);
        res.status(200).send(recurringCharge);
    }catch (error) {
        res.status(200).send(error);
    }
}


export async function getSubscriptions(req, res){
    const shop_url = `https://${res.locals.shopify.session.shop}`;
    const shop = await ShopsModel.readShop(shop_url);
    try {
        const response = await ShopsModel.readData(shop[0].shop_id);
        res.status(200).send(response);
    }catch (error){
        res.status(500).send(error);
    }
}

export async function checkSubscription(req, res){
    const shop_url = `https://${res.locals.shopify.session.shop}`;
    const shop = await ShopsModel.readShop(shop_url);
    const subscriber = await SubscriptionsModel.readSubscription(shop[0].shop_id);
    if(subscriber.length !== 0){
        const charge_id = subscriber[0].charge_id
        const subscription = await checkAppSubscription(req, res, charge_id);
        res.status(200).send(subscription);
    }else {
        res.status(200).send({"plan": "not Active"});
    }
}

export async function unsubscribe(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const charge_id = req.params.id;
    const shop_url = `https://${res.locals.shopify.session.shop}`;

    const shop = await ShopsModel.readShop(shop_url);
    const subscriber = await SubscriptionsModel.readSubscription(shop[0].shop_id);
    if(subscriber[0].charge_id === Number(charge_id)){
        const response = await unsubscribePlan(req, res)
        if(response.ok){
            try {
                await SubscriptionsModel.deleteSubscription(shop[0].shop_id);
                res.status(200).send();
            }catch (error){
                res.status(500).send(error);
            }
        }
    }
}