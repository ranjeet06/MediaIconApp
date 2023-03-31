import fetch from "node-fetch";

const planDetail = {
    basicPlan: { name: "Basic Plan", price: 0.5},
    premiumPlan: { name : "Premium Plan", price: 0.7}
};

export async function createSubscriberPlan(req, res) {
    const plan = req.body.plan;
    const session = res.locals.shopify.session;
    const url = `https://${session.shop}/admin/api/2022-10/recurring_application_charges.json`;
    const shopifyHeader = (token) => ({
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
    });
    const chargeData = {"recurring_application_charge":{
            "name":planDetail[plan].name,
            "price": planDetail[plan].price,
            "return_url": `https://${session.shop}/admin/apps/media-icon-app`,
            "trial_days":7,
            "test": true,
        }
    }

    const createRecurringCharge = await fetch(url, {
        method: "POST",
        body: JSON.stringify(chargeData),
        headers: shopifyHeader(session.accessToken)
    });
    if(createRecurringCharge.ok){
        const response = await createRecurringCharge.json();
        return response.recurring_application_charge
    }else {
        res.status(500).send(createRecurringCharge)
    }
}

export async function checkAppSubscription(req, res, charge_id){
    const session = res.locals.shopify.session;
    const accessToken = session.accessToken;
    const url = `https://${session.shop}/admin/api/2022-10/recurring_application_charges/${charge_id}.json`;
    const shopifyHeader = (token) => ({
        'X-Shopify-Access-Token': token,
    });

    const recurringChargeObject = await fetch(url, {
        method: "GET",
        headers: shopifyHeader(accessToken)
    });
    if(recurringChargeObject.ok){
        const response = await recurringChargeObject.json();
        return (response.recurring_application_charge);
    }
}

export async function unsubscribePlan(req, res){
    const charge_id = req.params.id;
    const session = res.locals.shopify.session;
    const accessToken = session.accessToken;
    const url = `https://${session.shop}/admin/api/2022-10/recurring_application_charges/${charge_id}.json`;
    const shopifyHeader = (token) => ({
        'X-Shopify-Access-Token': token,
    });

    return await fetch(url, {
        method: "DELETE",
        headers: shopifyHeader(accessToken)
    });
}