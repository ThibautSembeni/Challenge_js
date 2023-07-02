const {generateVerificationToken} = require("../../utils/user");

const HOST = 'http://localhost'
const PORT = '3000'


describe('Test register verify account', () => {
    const registerUrl = `${HOST}:${PORT}/register`
    const verificationUrl = `${HOST}:${PORT}/verify`

    it('Verify a customer user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'customer@user.com',
            password: 'password',
        }
        const registerResponse = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const registerData = await registerResponse.json();

        const jwtToken = generateVerificationToken(registerData)
        const verificationResponse = await fetch(`${verificationUrl}/${jwtToken}`);

        const verificationData = await verificationResponse.json();

        expect(verificationResponse.status).toBe(200);
        expect(verificationData.email).toBe(registrationData.email);
    });

    it('Verify a merchant user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'merchant@user.com',
            password: 'password',
            kbis: "kbis"
        }
        const registerResponse = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const registerData = await registerResponse.json();

        const jwtToken = generateVerificationToken(registerData)
        const verificationResponse = await fetch(`${verificationUrl}/${jwtToken}`);
        const verificationData = await verificationResponse.json()
        expect(verificationResponse.status).toBe(200);
        expect(verificationData.email).toBe(registrationData.email);
    });

    it('Verify status user before verification process', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'status@customer.com',
            password: 'password'
        }
        const registerResponse = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const registerData = await registerResponse.json();

        const jwtToken = generateVerificationToken(registerData)
        const verificationResponse = await fetch(`${verificationUrl}/${jwtToken}`);
        const verificationData = await verificationResponse.json();

        expect(verificationResponse.status).toBe(200);
        expect(verificationData.email).toBe(registrationData.email);
        expect(verificationData.status).toBe(true);
    });

    it('Get credentials for a merchant user', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'credentials@merchant.com',
            password: 'password',
            kbis: "kbis"
        }
        const registerResponse = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const registerData = await registerResponse.json();
        const userId = registerData.id
        const jwtToken = generateVerificationToken(registerData)
        const verificationResponse = await fetch(`${verificationUrl}/${jwtToken}`);
        const verificationData = await verificationResponse.json();

        expect(verificationResponse.status).toBe(200);
        expect(verificationData.user_id).toBe(userId);
        expect(verificationData.client_token).toBeDefined();
        expect(verificationData.client_secret).toBeDefined();
        expect(typeof verificationData.client_token).toBe('string');
        expect(typeof verificationData.client_secret).toBe('string');
    });

});
