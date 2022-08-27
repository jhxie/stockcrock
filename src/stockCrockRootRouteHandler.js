const moment = require("moment");
const {Utility} = require("./Utility");
const {StockCrockCalculator} = require("./StockCrockCalculator");

async function stockCrockRootRouteHandler(request, response) {
    const apiKey = Utility.getApiKeyFromEnvironment();
    const apiKeyProvided = apiKey != null && typeof apiKey === 'string' && apiKey.trim().length > 0

    const stockExchange = 'XNYS';
    const tickerCount = 3;
    const daysBeforeToday = 6;
    const from = moment().subtract(daysBeforeToday, 'days');
    const to = moment();

    let resultDescription;
    let flattenedStockPriceResults;

    if (apiKeyProvided) {
        resultDescription = `Aggregated stock pricing results from exchange ${stockExchange} ` +
            `between date ${Utility.formatMomentToDate(from)} and ${Utility.formatMomentToDate(to)}`;
        flattenedStockPriceResults =
            await StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to);
    }

    response.render("index", {
        title: "Home",
        apiKey,
        apiKeyProvided,
        resultDescription,
        flattenedStockPriceResults,
    });
}

module.exports = {stockCrockRootRouteHandler}
