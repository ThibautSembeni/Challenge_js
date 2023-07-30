const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require("mongoose");
const EmailSender = require("../../services/emailSender");
const { getUserBody, registerUser } = require("./users_utils");

describe('Test register', () => {
    EmailSender.mailjet = {
        post: jest.fn().mockReturnThis(),
        request: jest.fn().mockResolvedValue({ response: { request: { socket: { destroy: jest.fn() } } } })
    };

    let userExists

    const target = '/register';

    test('Register User', async () => {
        const accountValidationEmailSpy = jest.spyOn(EmailSender, 'accountValidationEmail');
        const registrationData = getUserBody()
        userExists = registrationData
        const response = await registerUser(registrationData)
        expect(response.status).toBe(201);
        expect(response.body.firstname).toBe(registrationData.firstname);
        expect(response.body.lastname).toBe(registrationData.lastname);
        expect(response.body.email).toBe(registrationData.email);
        expect(accountValidationEmailSpy).toHaveBeenCalled()
    });

    test('User already exists', async () => {
        const response = await registerUser(userExists);
        expect(response.status).toBe(409);
    });

    test('Register User with default role', async () => {
        const registrationData = getUserBody()
        const response = await registerUser(registrationData)
        expect(response.status).toBe(201);
        expect(response.body.role).toBe('merchant');
    });

    test('Register with incorrect email type', async () => {
        const registrationData = getUserBody()
        registrationData.email = 'inccorectemail'
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(422);
        expect(response.body.email).toBeDefined();
        expect(response.body.email).toContain("L'email doit être valide");
    });

    test('Register with incorrect password', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(422);
        expect(response.body.password).toBeDefined();
        expect(response.body.password).toContain("Validation len on password failed");
    });

    test('Register with multiple incorrect field', async () => {
        const registrationData = getUserBody()
        registrationData.firstname = 'f'
        registrationData.password = 'pass'

        const response = await registerUser(registrationData)

        expect(response.status).toBe(422);
        expect(response.body.password).toContain("Validation len on password failed");
        expect(response.body.firstname).toContain("Le prénom doit contenir entre 2 et 50 caractères");
    });

    test('inject role field & isActive in body', async () => {
        const registrationData = getUserBody()
        registrationData.role = 'admin'
        registrationData.isActive = true

        const response = await registerUser(registrationData)

        expect(response.status).toBe(201);
        expect(response.body.role).toBe('merchant')
        expect(response.body.isActive).toBe(false)
    });

    afterAll(async () => {
        await postgres.Credential.destroy({
            where: {},
        });
        await postgres.User.destroy({
            where: {},
        });
        await mongo.User.deleteMany({});
        await mongoose.connection.close();
    });
});