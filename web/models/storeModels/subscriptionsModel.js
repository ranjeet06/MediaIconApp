import {StoreDB} from "../db/sqlite3/storeDb.js";

export const SubscriptionsModel = {

    /*----------------------------------------------------------------------------------------------------------*/
    /* CURD methods on subscriptions table */

    createSubscription: async function (
        {
            shop_id,
            charge_id,
            selected_plan,
        }
    ) {
        await StoreDB.ready;
        const query = `
      INSERT INTO ${StoreDB.subscriptionsTableName}
      (shop_id, charge_id, selected_plan)
      VALUES (?, ?, ?)
      RETURNING id;
    `;

        return await StoreDB.__query(query, [
            shop_id,
            charge_id,
            selected_plan,
        ]);
    },

    updateSubscription: async function (
        {
            shop_id,
            charge_id,
            selected_plan,
        }
    ) {
        await StoreDB.ready;
        const query = `
      UPDATE ${StoreDB.subscriptionsTableName}
      SET
        charge_id = ?,
        selected_plan = ?
      WHERE
        shop_id = ?;
    `;

        return await StoreDB.__query(query, [
            charge_id,
            selected_plan,
            shop_id,
        ]);
    },

    readSubscription: async function (shop_id) {
        await StoreDB.ready;
        const query = `
      SELECT * FROM ${StoreDB.subscriptionsTableName}
      WHERE shop_id = ?;
    `;
        return await StoreDB.__query(query, [shop_id]);
    },


    deleteSubscription: async function (shop_id) {
        await StoreDB.ready;
        const query = `
      DELETE FROM ${StoreDB.subscriptionsTableName}
      WHERE shop_id = ?;
    `;
        await StoreDB.__query(query, [shop_id]);
        return true;
    },

};