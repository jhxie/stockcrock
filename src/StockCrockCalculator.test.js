const {describe, test, expect} = require("@jest/globals");
const moment = require("moment");
const {PolygonIOApi} = require("./api/PolygonIOApi");
const {StockCrockCalculator} = require("./StockCrockCalculator")
const {Utility} = require("./Utility");

jest.mock("./api/PolygonIOApi");

/**
 * The tests intentionally violates the DRY principle by avoiding using loop and conditional structure to
 * keep them simple because there are no tests written for tests themselves, so the tests should be easy to
 * infer their correctness by simply examining them.
 */
describe("StockCrockCalculator", () => {
    const stockExchange = 'XNYS';
    const tickerCount = 3;
    const daysBeforeToday = 6;
    const from = moment().subtract(daysBeforeToday, 'days');
    const to = moment();

    test("throws error when the tickers are not fetched properly", async () => {
        PolygonIOApi.getTickers.mockImplementation(() => Promise.resolve(null));

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).rejects.toThrowError();


        PolygonIOApi.getTickers.mockImplementation(() => Promise.resolve(['A']));

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).rejects.toThrowError();

        PolygonIOApi.getTickers.mockImplementation(() => Promise.resolve(['A', 'B', 'C']));

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).rejects.toThrowError();

        PolygonIOApi.getTickers.mockImplementation(
            () => Promise.resolve([{ ticker : 'A'}, { ticker : 'B' }])
        );

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).rejects.toThrowError();
    });

    test("throws error when the aggregates are not fetched properly", async () => {
        PolygonIOApi.getTickers.mockImplementation(
            () => Promise.resolve([{ ticker : 'A'}, { ticker : 'B' }, { ticker : 'C' }])
        );
        PolygonIOApi.getAggregates.mockImplementation(() => Promise.resolve(null));

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).rejects.toThrowError();
    });

    test("returns the flattened results when everything works as intended", async () => {
        PolygonIOApi.getTickers.mockImplementation(
            () => Promise.resolve([{ ticker : 'A', name : 'A' }, { ticker : 'B', name : 'B' }, { ticker : 'C', name : 'C' }])
        );
        const mockAggregateResult = {
            "c": 74.3575,
            "h": 75.145,
            "l": 74.125,
            "n": 1,
            "o": 74.2875,
            "t": 1578027600000,
            "v": 146535512,
            "vw": 74.7026
        };
        const expectedIndividualResult = {
            date : Utility.formatMomentToDate(moment(new Date(mockAggregateResult.t))),
            openPrice : Utility.formatCurrency(mockAggregateResult.o),
            closePrice : Utility.formatCurrency(mockAggregateResult.c),
            priceDifference : Utility.formatCurrency(
                Utility.generateCurrency(mockAggregateResult.c).subtract(Utility.generateCurrency(mockAggregateResult.o))
            ),
            highestPrice : Utility.formatCurrency(mockAggregateResult.h),
            lowestPrice : Utility.formatCurrency(mockAggregateResult.l),
            numberOfTransaction : mockAggregateResult.n,
            tradingVolume : mockAggregateResult.v,
            volumeWeightedAveragePrice : Utility.formatCurrency(mockAggregateResult.vw),
        };
        const expectedResults = [
            Object.assign({}, expectedIndividualResult, { ticker : 'A', company : 'A' }),
            Object.assign({}, expectedIndividualResult, { ticker : 'B', company : 'B' }),
            Object.assign({}, expectedIndividualResult, { ticker : 'C', company : 'C' })
        ];

        PolygonIOApi.getAggregates.mockImplementation(() => Promise.resolve([mockAggregateResult]));

        await expect(
            StockCrockCalculator.calculateFlattenedStockPriceResults(stockExchange, tickerCount, from, to)
        ).resolves.toEqual(expectedResults);
    });
});