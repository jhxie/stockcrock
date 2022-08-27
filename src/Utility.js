const moment = require("moment");
const currency = require("currency.js");

class Utility {
    static getApiKeyFromEnvironment() {
        return process.env.APIKEY;
    }

    static generateCurrency(value, extraOptions) {
        return currency(value, { precision : 4, errorOnInvalid : true, ...extraOptions });
    }

    static formatCurrency(value) {
        return this.generateCurrency(value).format();
    }

    static formatMomentToDate(value) {
        const dateFormat = 'YYYY-MM-DD';

        if (moment.isMoment(value)) {
            return value.format(dateFormat);
        } else {
            throw new TypeError(`Argument value {${value}} is not a moment object`);
        }
    }
}

module.exports = {Utility}
