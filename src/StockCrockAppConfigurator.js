const express = require("express");
const path = require("node:path");
const {StockCrockApi} = require("./api/StockCrockApi");
const {stockCrockRootRouteHandler} = require("./stockCrockRootRouteHandler");

class StockCrockAppConfigurator {
    static configureApp(app) {
        app.set("views", path.join(__dirname, "views"));
        app.set("view engine", "pug");
        app.use(express.static(path.join(__dirname, "public")));
    }

    static registerRoutes(app) {
        app.get(StockCrockApi.urls.index, stockCrockRootRouteHandler);
    }

    static activateApp(app) {
        const port = process.env.PORT || "8123";

        app.listen(port, () => {
            console.log(`Listening to requests on http://localhost:${port}`);
        });
    }
}

module.exports = {StockCrockAppConfigurator}
