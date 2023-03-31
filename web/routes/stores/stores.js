import {createShop, scriptTag, subscribeRequiredWebhook} from "../../controllers/shopController.js";

export default function applyStoreEndpoints(app) {

    /* Endpoint for stores details  */
    app.post("/api/stores", createShop);

    /* Endpoint for webhooks subscription  */
    app.post("/api/stores/webhooks/subscribe", subscribeRequiredWebhook);

    /* Endpoint for script tag insertion */
    app.get("/api/create-script-tag", scriptTag);
}