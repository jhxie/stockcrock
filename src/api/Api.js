const {URL} = require("node:url");
const fetch = require("node-fetch");
const {Utility} = require("../Utility");

/**
 * Helper class to communicate with API end-points with extra authorization info.
 */
class Api {

    static async get(url, params) {
        if (url == null || typeof url !== "string" || url.trim().length === 0) {
            throw new Error(`Argument url {${url}} is not valid`);
        }
        if (params != null && (typeof params !== "object" || Array.isArray(params))) {
            throw new Error(`Argument params is not an object containing argument key/value pairs`);
        }

        const builtURL = new URL(url);
        const urlSearchParams = builtURL.searchParams;

        if (params) {
            for (let property in params) {
                if (Object.hasOwn(params, property)) {
                    urlSearchParams.set(property, params[property]);
                }
            }
        }
        const paramString = urlSearchParams.toString();

        const response = await fetch(builtURL.toString(), {
            method : "GET",
            mode : "cors",
            headers : {
                "Authorization" : `Bearer ${Utility.getApiKeyFromEnvironment()}`
            },
        });

        if (!response.ok) {
            throw new Error(
                `Network request with URL {${url} and params {${paramString}} failed with ` +
                    `status code {${response.status}} due to reason {${response.statusText}}`
            );
        }

        return await response.json();
    }
}

module.exports = {Api}
