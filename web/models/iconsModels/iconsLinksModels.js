import {IconsDB} from "../db/sqlite3/iconsDb.js";

export const IconsLinksModel = {

    /* CURD methods on iconsLinks table */

        createIconLink: async function ({
                shop_id,
                display_order,
                icon_title,
                icon_link,
                icon,
                icon_color,
            }) {
            await IconsDB.ready;
            const query = ` 
                          INSERT INTO ${IconsDB.iconsLinksTableName}
                          (shop_id, display_order, icon_title, icon_link, icon, icon_color)
                          VALUES (?, ?, ?, ?, ?, ?)
                          RETURNING id; 
            `;

            return await IconsDB.__query(query, [
                shop_id,
                display_order,
                icon_title,
                icon_link,
                icon,
                icon_color,
            ]);
        },

        updateIconLink: async function ({
                id,
                shop_id,
                icon_link,
                icon_color,
            }) {
            await IconsDB.ready;
            const query = `UPDATE ${IconsDB.iconsLinksTableName}
                           SET
                            icon_link = ?,
                            icon_color = ?
                           WHERE
                            shop_id = ? AND id = ?;`;

            return await IconsDB.__query(query, [
                icon_link,
                icon_color,
                shop_id,
                id,
            ]);
        },


        updateIconsLinksDisplayOrder: async function ({
                                          id,
                                          shop_id,
                                          display_order
                                      }) {
            await IconsDB.ready;
            const query = `UPDATE ${IconsDB.iconsLinksTableName}
                           SET
                            display_order = ?
                           WHERE
                            id = ? AND shop_id = ?;`;

            await IconsDB.__query(query, [
                display_order,
                id,
                shop_id,
            ]);
            return true
        },


        getIconsLinksList: async function (shop_id) {
            await IconsDB.ready;
            const query = `SELECT * FROM ${IconsDB.iconsLinksTableName}
                           WHERE shop_id = ?
                           ORDER BY display_order ASC;`;

            return await IconsDB.__query(query, [shop_id]);
        },

        getIconLink: async function (id, shop_id) {
            await IconsDB.ready;
            const query = `SELECT * FROM ${IconsDB.iconsLinksTableName}
                               WHERE shop_id = ? AND id = ?;`;

            return await IconsDB.__query(query, [shop_id, id]);
        },


        deleteIconLink: async function (id, shop_id) {
                await IconsDB.ready;
                const query = `DELETE FROM ${IconsDB.iconsLinksTableName}
                               WHERE id = ? AND shop_id = ? ;`;

                await IconsDB.__query(query, [id, shop_id]);
                return true;
        },
    /*-----------------------------------------------------------------------------------------*/
        /* Delete method for webhooks */
        deleteAllIconLinkOfShop: async function (shop_id) {
            await IconsDB.ready;
            const query = `DELETE FROM ${IconsDB.iconsLinksTableName}
                                   WHERE shop_id = ? ;`;

            await IconsDB.__query(query, [shop_id]);
            return true;
        },


    /*----------------------------------------------------------------------------------------*/
        /*Read method for public endpoints */

        getIcons: async function (shop_id) {
          await IconsDB.ready;
          const query = `SELECT icon_link, icon_title, icon_color, icon FROM ${IconsDB.iconsLinksTableName}
                         WHERE shop_id = ?
                         ORDER BY display_order ASC;`;

          return await IconsDB.__query(query, [shop_id]);
        },
};