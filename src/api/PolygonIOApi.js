const {Api} = require("./Api");
const {Utility} = require("../Utility");

/**
 * External API wrapper for the "Polygon.io" website.
 */
class PolygonIOApi {
    static urls = (function() {
        let index = "https://api.polygon.io/";

        return {
            index,

            tickers : `${index}v3/reference/tickers`,

            aggregates : function(stocksTicker, multiplier, timespan, from, to) {

                from = Utility.formatMomentToDate(from);
                to = Utility.formatMomentToDate(to);
                return `${index}v2/aggs/ticker/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}`
            },
        };
    }());

    static async getTickers(type, market, exchange, sort, limit) {
        return await this.get(this.urls.tickers, {
            type,
            market,
            exchange,
            sort,
            limit
        })
    }

    static async getAggregates(stocksTicker, multiplier, timespan, from, to, sort="asc") {
        return await this.get(this.urls.aggregates(stocksTicker, multiplier, timespan, from, to), { sort });
    }

    static #ACCEPTED_STATUS = new Set(["OK", "DELAYED"]);

    static async get(url, params) {
        const responseObject = await Api.get(url, params);

        if (!this.#ACCEPTED_STATUS.has(responseObject.status)) {
            throw new Error(`Polygon.io request with URL {${url}} and params {${JSON.stringify(params)} failed`);
        }

        return responseObject.results;
    }
}

module.exports = {PolygonIOApi}