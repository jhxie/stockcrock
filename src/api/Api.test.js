const {describe, test, expect} = require("@jest/globals");
const fetch = require("node-fetch");
const {Api} = require("./Api");

jest.mock("node-fetch", () => jest.fn());

describe("Api", () => {
    const testUrl = 'https://github.com';

    test("throws error when the arguments are invalid", async () => {
        await expect(Api.get(null)).rejects.toThrowError();
        await expect(Api.get([])).rejects.toThrowError();
        await expect(Api.get({})).rejects.toThrowError();
        await expect(Api.get('')).rejects.toThrowError();
        await expect(Api.get(testUrl, [])).rejects.toThrowError();
    });

    test("throws error when the network request failed", async () => {
        fetch.mockImplementation(() => Promise.resolve({ ok : false }));
        await expect(Api.get(testUrl)).rejects.toThrowError();
    });

    test("returns the json result when everything works as intended", async () => {
        const mockJsonCallback = jest.fn(() => Promise.resolve());
        fetch.mockImplementation(() => Promise.resolve({ ok : true, json : mockJsonCallback }));
        await expect(Api.get(testUrl));
        expect(mockJsonCallback.mock.calls.length).toBe(1);
    });
});
