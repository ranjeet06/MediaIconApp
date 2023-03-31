import {body, param} from 'express-validator';
import {
    createLinks, deleteLink,
    getLinks,
    updateDisplayOrder,
    updateLink
} from "../../controllers/mediaIcons/iconsLinksController.js";

export default function applyIconsLinksApiEndpoints(app) {

    /* Endpoints for icons links  */

    app.post("/api/media_icons/links",
        body('icon_title').isString().isLength({min:5, max:30}),
        body('icon_link').isURL(),
        body('icon_color').isString().isLength({max:20}),
        body('display_order').isInt({min:1}),
        createLinks
    );

    app.get("/api/media_icons/links", getLinks);


    app.patch("/api/media_icons/links/:id",
        body('icon_link').isURL(),
        body('icon_color').isString().isLength({max:20}),
        param('id').isInt({min:1}),
        updateLink
    );

    app.patch("/api/media_icons/links/display_order/:id",
        body('display_order').isInt({min:1}),
        param('id').isInt({min:1}),
        updateDisplayOrder
    );

    app.delete("/api/media_icons/links/:id",
        param('id').isInt({min:1}),
        deleteLink
    );
}