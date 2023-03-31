/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";
import {StoreDB} from "./storeDb.js";

const DEFAULT_DB_FILE = path.join(process.cwd(), "icons_db.sqlite");

export const IconsDB = {
    iconsConfigurationTableName: "iconsConfigurations12",
    iconsLinksTableName: "iconsLinks1234",
    db: null,
    ready: null,
/*------------------------------------------------------------------------------------------------------*/
    /*
      Used to check whether to create the database.
      Also used to make sure the database and table are set up before the server starts.
    */


    __hasIconsConfigurationTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.iconsConfigurationTableName]);
        return rows.length === 1;
    },


    /* Initializes the connection with the app's sqlite3 database */
    initIconsConfigurationTable: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasIconsConfigurationTable = await this.__hasIconsConfigurationTable();

        if (hasIconsConfigurationTable) {
            this.ready = Promise.resolve();

            /* Create the iconsConfigurations table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.iconsConfigurationTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop_id INTEGER,
          position VARCHAR(511) NOT NULL,
          vertical_position INTEGER NOT NULL,
          horizontal_position INTEGER NOT NULL,
          shape VARCHAR(255) NOT NULL,
          icon_size INTEGER NOT NULL,
          app_status VARCHAR(255) NOT NULL,
          appearance_location VARCHAR(255) NOT NULL,
          minimization BOOLEAN NOT NULL,
          mobile_behaviour BOOLEAN NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
          FOREIGN KEY (shop_id) REFERENCES  ${StoreDB.shopsTableName} (shop_id)
        )
      `;
            /* Tell the various CRUD methods that they can execute */

            this.ready = this.__query(query);
        }
    },

    /*--------------------------------------------------------------------------------------------------*/


    __hasIconsLinksTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.iconsLinksTableName]);
        return rows.length === 1;
    },


    /* Initializes the connection with the app's sqlite3 database */
    initIconsLinksTable: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasIconsLinksTable = await this.__hasIconsLinksTable();

        if (hasIconsLinksTable) {
            this.ready = Promise.resolve();
            /* Create the iconsLinks table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.iconsLinksTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop_id INTEGER,
          display_order INTEGER NOT NULL,
          icon_title VARCHAR(511) NOT NULL,
          icon_link VARCHAR(511) NOT NULL,
          icon VARCHAR(511) NOT NULL,
          icon_color VARCHAR(511) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
          FOREIGN KEY (shop_id) REFERENCES  ${StoreDB.shopsTableName} (shop_id)
        )
      `;
            /* Tell the various CRUD methods that they can execute */

            this.ready = this.__query(query);
        }
    },

    /*--------------------------------------------------------------------------------------------------*/

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
