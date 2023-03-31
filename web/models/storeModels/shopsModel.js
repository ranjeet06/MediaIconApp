import {StoreDB} from "../db/sqlite3/storeDb.js";

export const ShopsModel = {
    /*----------------------------------------------------------------------------------------------------------*/
    /* CURD methods on shops table */

    createShop: async function (
        {
            id,
            shop_url,
            shop_id,
            shop_owner_name,
            shop_owner_email,
        }
    ) {
        await StoreDB.ready;
        const query = `
      INSERT INTO ${StoreDB.shopsTableName}
      (id, shop_url, shop_id, shop_owner_name, shop_owner_email)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id;
    `;

        return await StoreDB.__query(query, [
            id,
            shop_url,
            shop_id,
            shop_owner_name,
            shop_owner_email,
        ]);
    },

    updateShop: async function (
        {
            shop_url,
            shop_id,
            shop_owner_name,
            shop_owner_email,
        }
    ) {
        await StoreDB.ready;
        const query = `
      UPDATE ${StoreDB.shopsTableName}
      SET
        shop_url = ?,
        shop_owner_name = ?,
        shop_owner_email = ?
      WHERE
        shop_id = ?;
    `;

        return await StoreDB.__query(query, [
            shop_url,
            shop_owner_name,
            shop_owner_email,
            shop_id,
        ]);
    },

    readShop: async function (shop_url) {
        await StoreDB.ready;
        const query = `
      SELECT * FROM ${StoreDB.shopsTableName}
      WHERE shop_url = ?;
    `;
        return await StoreDB.__query(query, [shop_url]);
    },


    deleteShop: async function (shop_id) {
        await StoreDB.ready;
        const query = `
      DELETE FROM ${StoreDB.shopsTableName}
      WHERE shop_id = ?;
    `;
        await StoreDB.__query(query, [shop_id]);
        return true;
    },

    readData: async function (shop_id){
        await StoreDB.ready;

        const query = `SELECT shop_owner_name, shop_owner_email, selected_plan, charge_id, ${StoreDB.subscriptionsTableName}.shop_id
        AS shop_id, ${StoreDB.subscriptionsTableName}.id
        FROM ${StoreDB.subscriptionsTableName}
        INNER JOIN ${StoreDB.shopsTableName}
        ON ${StoreDB.subscriptionsTableName}.shop_id = ${StoreDB.shopsTableName}.shop_id
        WHERE ${StoreDB.subscriptionsTableName}.shop_id = ?;
        `;

        return await StoreDB.__query(query, [shop_id]);
    }
};