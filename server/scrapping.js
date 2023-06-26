require('dotenv').config();

const scrappingApiKey = process.env.SCRAPPING_API_KEY;

const getScrappingExchangeRates = async () => {
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${scrappingApiKey}`;

    try {
        const response = await fetch(apiUrl);
        
        if(!response.ok) {
            throw new Error(`Erreur lors de la récupération des taux de change (${response.status} : ${response.statusText})`);
        }
        
        const exchangeRates = await response.json();
        return exchangeRates;
    } catch (error) {
        console.error('Erreur lors du scrapping des taux de change :', error);
        return null;
    }
};

module.exports = { getScrappingExchangeRates };