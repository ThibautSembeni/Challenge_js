const { getScrappingExchangeRates } = require('../../utils/scrapping');

describe('Test scrapping', () => {
    test('Get scrapping exchange rates', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates).not.toBe(null);
    });
    test('Get scrapping exchange rates result', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates).toEqual(expect.objectContaining({
            disclaimer: expect.stringContaining('Usage subject to terms: https://openexchangerates.org/terms'),
            license: expect.stringContaining('https://openexchangerates.org/license'),
            timestamp: expect.any(Number),
            base: 'USD',
            rates: expect.any(Object),
        }));
    });
    test('Get scrapping exchange rates result rates', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates.rates).toEqual(expect.objectContaining({
            EUR: expect.any(Number),
            GBP: expect.any(Number),
            USD: expect.any(Number),
        }));
    });
    test('Get scrapping exchange rates result rates EUR', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates.rates.EUR).toBeGreaterThan(0);
    });
    test('Get scrapping exchange rates result rates USD', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates.rates.USD).toBeGreaterThan(0);
    });
    test('Get scrapping exchange rates result rates GBP', async () => {
        const exchangeRates = await getScrappingExchangeRates();
        expect(exchangeRates.rates.GBP).toBeGreaterThan(0);
    });
});