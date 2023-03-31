import {
    checkSubscription,
    createSubscriptions,
    getSubscriptions, unsubscribe,
    updateSubscriptions
} from "../../controllers/subscriptionController.js";
import {body, param} from "express-validator";

export default async function appSubscriptions(app) {

    /* Endpoints for app subscriptions */

    app.post("/api/media_icons/subscriptions",
        body('plan').isString().isLength({min:5, max:50}),
        createSubscriptions);

    app.patch("/api/media_icons/subscriptions/:id",
        body('plan').isString().isLength({min:5, max:50}),
        body('shop_id').notEmpty().isInt(),
        param('id').notEmpty().isInt(),
        updateSubscriptions);

    app.get("/api/media_icons/subscriptions", getSubscriptions);

    app.get("/api/media_icons/subscriptions/check", checkSubscription);

    app.delete("/api/media_icons/subscriptions/:id",
        param('id').notEmpty().isInt(),
        unsubscribe);
}