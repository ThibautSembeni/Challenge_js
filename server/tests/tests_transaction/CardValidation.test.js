const validateCardNumber = require('../../utils/cardValidation');

describe('Test card validation', () => {
    test('Validate card number with dashes', () => {
        const cardNumber = '4242-4242-4242-4242';
        const cvv = '123';
        const expirationDate = '12/24';
        expect(validateCardNumber(cardNumber, cvv, expirationDate)).toBe(true);
    });
    test('Validate card number with spaces', () => {
        expect(validateCardNumber('4242 4242 4242 4242', '123', '12/24')).toBe(true);
    });
    test('Unvalidate card number', () => {
        expect(validateCardNumber('0000 4242 4242 4241', '123', '12/24')).toBe(false);
    });
    test('Unvalidate cvv', () => {
        expect(validateCardNumber('4242 4242 4242 4242', '12', '12/24')).toBe(false);
    });
    test('Unvalidate expiration date', () => {
        expect(validateCardNumber('4242 4242 4242 4242', '123', '12/20')).toBe(false);
    });
});
