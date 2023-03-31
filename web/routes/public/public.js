import {query} from "express-validator";
import {getConfigurationForClient} from "../../controllers/mediaIcons/iconsConfigurationsController.js";
import {getIconsLinkForClient} from "../../controllers/mediaIcons/iconsLinksController.js";


export default function applyPublicApiEndpoints(app) {

    app.get("/api/media_icons/icons_configurations",
        query('shop_url').isURL(),
        getConfigurationForClient
    );

    app.get("/api/media_icons/icons_links",
        query('shop_url').isURL(),
        getIconsLinkForClient
    );

}