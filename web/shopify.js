import '@shopify/shopify-api/adapters/node';
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01";
import { join } from "path";
import {StoreDB} from "./models/db/sqlite3/storeDb.js";
import {IconsDB} from "./models/db/sqlite3/iconsDb.js";

const dbFile = join(process.cwd(), "database.sqlite");
const sessionDb = new SQLiteSessionStorage(dbFile);
// Initialize SQLite DB
StoreDB.initShopsTable().then();
StoreDB.initWebhooksTable().then();
StoreDB.initSubscriptionsTable().then();
IconsDB.initIconsConfigurationTable().then();
IconsDB.initIconsLinksTable().then();

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: sessionDb,
});


export default shopify;
