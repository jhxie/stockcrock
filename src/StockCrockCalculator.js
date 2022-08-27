const moment = require("moment");
const {PolygonIOApi} = require("./api/PolygonIOApi");
const {Utility} = require("./Utility");

class StockCrockCalculator {
    static async calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to) {
        const flattenedStockPriceResults = [];
        const selectedTickers =
            await PolygonIOApi.getTickers("CS", "stocks", stockExchange, "ticker", tickerCount);

        if (selectedTickers == null || !Array.isArray(selectedTickers) || selectedTickers.length !== tickerCount) {
            throw new Error(`PolygonIOApi.getTickers method does not fetch the requested {${tickerCount}} number of tickers`);
        }

        for (let selectedTicker of selectedTickers) {
            let selectedTickerLabel = selectedTicker.ticker
            if (selectedTickerLabel == null || typeof selectedTickerLabel !== 'string' || selectedTickerLabel.trim().length === 0) {
                throw new Error(`There is no ticker property defined for selectedTicker {${selectedTickerLabel}}`)
            }

            let aggregateResults = await PolygonIOApi.getAggregates(selectedTickerLabel, 1, 'day', from, to);

            if (aggregateResults == null || !Array.isArray(aggregateResults) || aggregateResults.length === 0) {
                throw new Error(`PolygonIOApi.getAggregates method does not fetch the requested aggregated results`);
            }

            flattenedStockPriceResults.push(...(aggregateResults.map(r => this.#calculateAggregateWithPriceDifference(r, {
                ticker : selectedTickerLabel,
                company : selectedTicker.name
            }))));
        }

        return flattenedStockPriceResults;
    }

    static #calculateAggregateWithPriceDifference(aggregateResult, extraFields) {

        return {
            date : Utility.formatMomentToDate(moment(new Date(aggregateResult.t))),
            openPrice : Utility.formatCurrency(aggregateResult.o),
            closePrice : Utility.formatCurrency(aggregateResult.c),
            priceDifference : Utility.formatCurrency(
                Utility.generateCurrency(aggregateResult.c).subtract(Utility.generateCurrency(aggregateResult.o))
            ),
            highestPrice : Utility.formatCurrency(aggregateResult.h),
            lowestPrice : Utility.formatCurrency(aggregateResult.l),
            numberOfTransaction : aggregateResult.n,
            tradingVolume : aggregateResult.v,
            volumeWeightedAveragePrice : Utility.formatCurrency(aggregateResult.vw),
            ...extraFields
        };
    }
}

module.exports = {StockCrockCalculator}