import {StoreDB} from "../db/sqlite3/storeDb.js";

export const WebhooksModel = {

    /*----------------------------------------------------------------------------------------------------------*/
    /* CURD methods on webhooks table */

    createWebhook: async function ({
            shop_id,
            topic,
            x_shopify_webhook_id,
        }) {
        await StoreDB.ready;
        const query = `
      INSERT INTO ${StoreDB.webhooksTableName}
      (shop_id, topic, x_shopify_webhook_id)
      VALUES (?, ?, ?)
      RETURNING id;
    `;

        return await StoreDB.__query(query, [
            shop_id,
            topic,
            x_shopify_webhook_id,
        ]);
    },

    updateWebhook: async function ({
            shop_id,
            topic,
            x_shopify_webhook_id,
        }) {
        await StoreDB.ready;
        const query = `
      UPDATE ${StoreDB.webhooksTableName}
      SET
        x_shopify_webhook_id = ?
      WHERE
        shop_id = ? AND topic = ?;
    `;

        return await StoreDB.__query(query, [
            topic,
            x_shopify_webhook_id,
            shop_id,
        ]);
    },

    readWebhook: async function (
        shop_id,
        topic,
    ) {
        await StoreDB.ready;
        const query = `
      SELECT * FROM ${StoreDB.webhooksTableName}
      WHERE shop_id = ? AND topic = ?;
    `;
        return await StoreDB.__query(query, [shop_id, topic]);
    },


    deleteWebhook: async function (shop_id) {
        await StoreDB.ready;
        const query = `
      DELETE FROM ${StoreDB.webhooksTableName}
      WHERE shop_id = ?;
    `;
        await StoreDB.__query(query, [shop_id]);
        return true;
    },

};