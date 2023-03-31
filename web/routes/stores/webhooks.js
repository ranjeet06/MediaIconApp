import {
    appUninstalled,
    customersDataRequest, customersRedact, shopRedact,
    shopUpdate, updateSubscriptionsPlan
} from "../../controllers/webhookController.js";
import {updateSubscriptions} from "../../controllers/subscriptionController.js";

export default function applyWebhooks(app){

    /* Endpoints for webhooks for Shopify */

    app.post("/api/webhooks/app_subscription_update", updateSubscriptionsPlan);

    app.post("/api/webhooks/app_uninstalled", appUninstalled);

    app.post("/api/webhooks/shop_update", shopUpdate);

    app.post("/api/webhooks/customers_data_request", customersDataRequest);

    app.post("/api/webhooks/customers_redact", customersRedact);

    app.post("/api/webhooks/shop_redact", shopRedact);
}


// TODO SET MANDATORY WEBHOOKS ENDPOINTS ON SHOPIFY PARTNER DASHBOARD