const { generateVerificationToken } = require("../../utils/user");
const request = require("supertest");
const app = require("../../server");
const db = require("../../db/index");

const HOST = 'http://localhost'
const PORT = '3000'


describe('Test register verify account', () => {
    const registerUrl = `/register`
    const verificationUrl = `/verify`

    test('Verify a customer user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'customer@user.com',
            password: 'password',
        }
        const registerResponse = await request(app).post(registerUrl).send(registrationData);

        const jwtToken = generateVerificationToken(registerResponse.body);
        const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);

        expect(verificationResponse.status).toBe(200);
        expect(verificationResponse.body.email).toBe(registrationData.email);
    });

    test('Verify a merchant user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'merchant@user.com',
            password: 'password',
            kbis: "kbis"
        }
        const registerResponse = await request(app).post(registerUrl).send(registrationData);

        const jwtToken = generateVerificationToken(registerResponse.body);

        const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);
        expect(verificationResponse.status).toBe(200);
        // expect(verificationResponse.body.email).toBe(registrationData.email);
    });

    test('Verify status user before verification process', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'status@customer.com',
            password: 'password'
        }
        const registerResponse = await request(app).post(registerUrl).send(registrationData);

        const jwtToken = generateVerificationToken(registerResponse.body)
        const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);

        expect(verificationResponse.status).toBe(200);
        expect(verificationResponse.body.email).toBe(registrationData.email);
        expect(verificationResponse.body.status).toBe(true);
    });

    test('Get credentials for a merchant user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'credentials@merchant.com',
            password: 'password',
            kbis: "kbis"
        }
        const registerResponse = await request(app).post(registerUrl).send(registrationData);

        const userId = registerResponse.body.id;
        const jwtToken = generateVerificationToken(registerResponse.body);

        const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);

        expect(verificationResponse.status).toBe(200);
        expect(verificationResponse.body.user_id).toBe(userId);
        expect(verificationResponse.body.client_token).toBeDefined();
        expect(verificationResponse.body.client_secret).toBeDefined();
        expect(typeof verificationResponse.body.client_token).toBe('string');
        expect(typeof verificationResponse.body.client_secret).toBe('string');
    });

});
