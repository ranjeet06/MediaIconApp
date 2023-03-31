/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "merchant_db.sqlite");

export const StoreDB = {
    shopsTableName: "shops2",
    webhooksTableName: "webhooks3",
    subscriptionsTableName: "subscriptions210",
    db: null,
    ready: null,

    /*
      Used to check whether to create the database.
      Also used to make sure the database and table are set up before the server starts.
    */

    __hasShopsTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.shopsTableName]);
        return rows.length === 1;
    },

    /* Initializes the connection with the app's sqlite3 database */
    initShopsTable: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasShopsTable = await this.__hasShopsTable();

        if (hasShopsTable) {
            this.ready = Promise.resolve();

            /* Create the shop table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.shopsTableName} (
          id BLOB NOT NULL,
          shop_url VARCHAR(255) NOT NULL,
          shop_id INTEGER PRIMARY KEY NOT NULL,
          shop_owner_name VARCHAR(255) NOT NULL,
          shop_owner_email VARCHAR(255) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;
            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    /*------------------------------------------------------------------------*/

    __hasWebhooksTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.webhooksTableName]);
        return rows.length === 1;
    },

    /* Initializes the connection with the app's sqlite3 database */
    initWebhooksTable: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasWebhooksTable = await this.__hasWebhooksTable();

        if (hasWebhooksTable) {
            this.ready = Promise.resolve();

            /* Create the webhooks table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.webhooksTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop_id INTEGER,
          topic VARCHAR(255) NOT NULL,
          x_shopify_webhook_id VARCHAR(255) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
          FOREIGN KEY (shop_id) REFERENCES  ${this.shopsTableName} (shop_id)
        )
      `;
            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    /*-------------------------------------------------------------------------*/

    __hasSubscriptionsTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.subscriptionsTableName]);
        return rows.length === 1;
    },

    /* Initializes the connection with the app's sqlite3 database */
    initSubscriptionsTable: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasSubscriptionsTable = await this.__hasSubscriptionsTable();

        if (hasSubscriptionsTable) {
            this.ready = Promise.resolve();

            /* Create the subscriptions table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.subscriptionsTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop_id INTEGER,
          charge_id INTEGER NOT NULL,
          selected_plan VARCHAR(255) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
          FOREIGN KEY (shop_id) REFERENCES  ${this.shopsTableName} (shop_id)
        )
      `;
            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    /*------------------------------------------------------------------------------------------------------------*/
    /* Perform a query on the database. Used by the various CRUD methods. */
    __query: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },
};