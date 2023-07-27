const cardValidator = require('card-validator');

function validateCardNumber(cardNumber, cvv, expirationDate) {
    // suppression des espaces et des tirets
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, ''); 

    // vérification que la chaîne ne contient que des chiffres
    if(!/^\d+$/.test(cleanedCardNumber)) return false; 

    // validation du numéro de carte
    const cardNumberValidation = cardValidator.number(cleanedCardNumber);
    if(!cardNumberValidation.isPotentiallyValid || !cardNumberValidation.isValid) return false;

    // validation du CVV
    const cvvValidation = cardValidator.cvv(cvv);
    if(!cvvValidation.isPotentiallyValid || !cvvValidation.isValid) return false;

    // validation de la date d'expiration
    const expirationDateValidation = cardValidator.expirationDate(expirationDate);
    if(!expirationDateValidation.isPotentiallyValid || !expirationDateValidation.isValid) return false;

    return true;
}

module.exports = validateCardNumber;