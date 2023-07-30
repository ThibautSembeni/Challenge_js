const {generateVerificationToken} = require("../../utils/user");
const request = require("supertest");
const app = require("../../server");
const EmailSender = require("../../services/emailSender");
const {getUserBody, registerUser, createRandomUser} = require("./users_utils");

describe('Test register verify account', () => {
    EmailSender.mailjet = {
        post: jest.fn().mockReturnThis(),
        request: jest.fn().mockResolvedValue({response: {request: {socket: {destroy: jest.fn()}}}})
    };

    const verificationUrl = `/merchant/demand/update`


    test('Verify a merchant account', async () => {
        const registerResponse = await createRandomUser()
        console.log("res", registerResponse)
        const jwtToken = await generateVerificationToken(registerResponse);
        const encodedToken = Buffer.from(jwtToken).toString('base64url');

        const confirmationBody = {
            kbis: 'kbis',
            company: 'company',
            phone_number: '0102030405',
            confirmation_url: 'confirmation_url',
            cancellation_url: 'cancellation_url',
            merchant_url: 'merchant_url',
            payout_currency: 'EUR',
        }

        const verificationResponse = await request(app).post(`${verificationUrl}/${encodedToken}`).send(confirmationBody);
        expect(verificationResponse.status).toBe(200);
        expect(verificationResponse.body.status).toBe('pending');
        expect(verificationResponse.body.kbis).toBe(confirmationBody.kbis);
        expect(verificationResponse.body.company).toBe(confirmationBody.company);
        expect(verificationResponse.body.phone_number).toBe(confirmationBody.phone_number);
        expect(verificationResponse.body.confirmation_url).toBe(confirmationBody.confirmation_url);
        expect(verificationResponse.body.cancellation_url).toBe(confirmationBody.cancellation_url);
        expect(verificationResponse.body.merchant_url).toBe(confirmationBody.merchant_url);
        expect(verificationResponse.body.payout_currency).toBe(confirmationBody.payout_currency);
    });

});