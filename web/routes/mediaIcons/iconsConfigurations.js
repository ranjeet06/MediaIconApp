import {body, param} from 'express-validator';
import {
    deleteConfiguration,
    getConfigurations,
    setConfigurations,
    updateConfigurations
} from "../../controllers/mediaIcons/iconsConfigurationsController.js";

export default function applyIconsConfigurationApiEndpoints(app) {

    /* Endpoints for icons configurations  */

    app.post("/api/media_icons/configurations",
        body('position').isString().isLength({min:5, max:20}),
        body('vertical_position').isInt({min:0, max:50}),
        body('horizontal_position').isInt({min:0, max:50}),
        body('shape').isString().isLength({min:5, max:20}),
        body('icon_size').isInt({min:0, max:80}),
        body('app_status').isString().isLength({min:5, max:20}),
        body('appearance_location').isString().isLength({min:5, max:30}),
        body('minimization').isBoolean(),
        body('mobile_behaviour').isBoolean(),
        setConfigurations
    );

    app.patch("/api/media_icons/configurations/:id",
        body('position').isString().isLength({min:5, max:20}),
        body('vertical_position').isInt({min:0, max:50}),
        body('horizontal_position').isInt({min:0, max:50}),
        body('shape').isString().isLength({min:5, max:20}),
        body('icon_size').isInt({min:0, max:80}),
        body('app_status').isString().isLength({min:5, max:20}),
        body('appearance_location').isString().isLength({min:5, max:30}),
        body('minimization').isBoolean(),
        body('mobile_behaviour').isBoolean(),
        param('id').notEmpty(),
        updateConfigurations
    );

    app.get("/api/media_icons/configurations", getConfigurations);

    app.delete("/api/media_icons/configurations/id",
        param('id').notEmpty(),
        deleteConfiguration
    );
}