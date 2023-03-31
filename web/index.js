// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import applyPublicApiEndpoints from "./routes/public/public.js";
import bodyParser from "express";
import applyWebhooks from "./routes/stores/webhooks.js";
import applyStoreEndpoints from "./routes/stores/stores.js";
import appSubscriptions from "./routes/stores/subscriptions.js";
import applyIconsLinksApiEndpoints from "./routes/mediaIcons/iconsLinks.js";
import applyIconsConfigurationApiEndpoints from "./routes/mediaIcons/iconsConfigurations.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(bodyParser.raw());
applyWebhooks(app);

app.use(express.json());

// public endpoints
applyPublicApiEndpoints(app);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

applyStoreEndpoints(app);
appSubscriptions(app);
applyIconsLinksApiEndpoints(app);
applyIconsConfigurationApiEndpoints(app);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);