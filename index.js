/**
 * Required External Modules
 */
const express = require("express");
const {StockCrockAppConfigurator} = require("./src/StockCrockAppConfigurator");

/**
 * App Variables
 */

const app = express();

/**
 *  App Configuration
 */
StockCrockAppConfigurator.configureApp(app);

/**
 * Routes Definitions
 */
StockCrockAppConfigurator.registerRoutes(app);

/**
 * Server Activation
 */
StockCrockAppConfigurator.activateApp(app);