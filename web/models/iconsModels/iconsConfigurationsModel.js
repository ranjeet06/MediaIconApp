import {IconsDB} from "../db/sqlite3/iconsDb.js";

export const IconsConfigurationsModel = {
    /*----------------------------------------------------------------------------------------------------------*/
    /* CURD methods on iconsConfigurations table */

    setIconsConfiguration: async function ({
            shop_id,
            position,
            vertical_position,
            horizontal_position,
            shape,
            icon_size,
            app_status,
            appearance_location,
            minimization,
            mobile_behaviour,
        }) {
        await IconsDB.ready;
        const query = `INSERT INTO ${IconsDB.iconsConfigurationTableName}
                       (shop_id, position, vertical_position, horizontal_position, shape, icon_size, app_status, appearance_location, minimization, mobile_behaviour)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                       RETURNING id;`;

        return await IconsDB.__query(query, [
            shop_id,
            position,
            vertical_position,
            horizontal_position,
            shape,
            icon_size,
            app_status,
            appearance_location,
            minimization,
            mobile_behaviour
        ]);
    },

    updateIconsConfiguration: async function ({
            shop_id,
            position,
            vertical_position,
            horizontal_position,
            shape,
            icon_size,
            app_status,
            appearance_location,
            minimization,
            mobile_behaviour,
        }) {
        await IconsDB.ready;
        const query = `UPDATE ${IconsDB.iconsConfigurationTableName}
                       SET
                        position = ?,
                        vertical_position = ?,
                        horizontal_position = ?,
                        shape = ?,
                        icon_size = ?,
                        app_status = ?,
                        appearance_location = ?,
                        minimization = ?,
                        mobile_behaviour = ?
                       WHERE
                        shop_id = ?;`;

        return await IconsDB.__query(query, [
            position,
            vertical_position,
            horizontal_position,
            shape,
            icon_size,
            app_status,
            appearance_location,
            minimization,
            mobile_behaviour,
            shop_id,
        ]);
    },

    readIconsConfigurations: async function (shop_id) {
        await IconsDB.ready;
        const query = `SELECT * FROM ${IconsDB.iconsConfigurationTableName}
                       WHERE shop_id = ?;`;

        return await IconsDB.__query(query, [shop_id]);
    },


    deleteIconsConfigurations: async function (shop_id) {
        await IconsDB.ready;
        const query = `DELETE FROM ${IconsDB.iconsConfigurationTableName}
                       WHERE shop_id = ?;`;

        await IconsDB.__query(query, [shop_id]);
        return true;
    },

/*-----------------------------------------------------------------------------------------------*/
    /* Read method for public endpoints */

    getIconsConfigurations: async function (shop_id) {
        await IconsDB.ready;
        const query = `SELECT position, vertical_position, horizontal_position, shape, icon_size, app_status, appearance_location, minimization, mobile_behaviour
                       FROM ${IconsDB.iconsConfigurationTableName}
                       WHERE shop_id = ?;`;

        return await IconsDB.__query(query, [shop_id]);
    },
};