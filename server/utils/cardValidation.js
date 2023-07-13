function validateCardNumber(cardNumber) {
    // suppression des espaces et des tirets
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, ''); 

    // vérification que la chaîne ne contient que des chiffres
    if(!/^\d+$/.test(cleanedCardNumber)) return false; 

    const cardNumberArray = cleanedCardNumber.split('').map(Number);

    let sum = 0;
    let isEven = false;

    // utilisation de l'algorithme de Luhn
    for(let i = cardNumberArray.length - 1; i >= 0; i--) {
        let currentNumber = cardNumberArray[i];

        if(isEven) { 
            currentNumber *= 2; 
            if(currentNumber > 9) { 
                currentNumber -= 9; 
            }
        }

        sum += currentNumber; 
        isEven = !isEven; 
    }

    return sum % 10 === 0; 
}

module.exports = validateCardNumber;