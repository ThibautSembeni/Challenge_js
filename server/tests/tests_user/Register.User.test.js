const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require("mongoose");

describe('Test register', () => {
    const target = '/register';

    test('Register User', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@test.com',
            password: 'password',
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(201);
        expect(response.body.firstname).toBe(registrationData.firstname);
        expect(response.body.lastname).toBe(registrationData.lastname);
        expect(response.body.email).toBe(registrationData.email);
    });

    test('User already exists', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@test.com',
            password: 'password',
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(409);
    });

    test('Register User with customer role', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'customer@test.com',
            password: 'password',
        }
        const response = await request(app).post(target).send(registrationData);


        expect(response.status).toBe(201);
        expect(response.body.role).toBe('customer');
    });

    test('Register User with merchant role', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'merchant@test.com',
            password: 'password',
            kbis: 'kbis',
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(201);
        expect(response.body.role).toBe('merchant');
    });

    test('Register with incorrect email type', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'incorrectEmail.com',
            password: 'password',
            kbis: 'kbis',
        }

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
        const registrationData = {
            firstname: 'f',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(422);
        expect(response.body).toBeDefined();
        expect(response.body.password).toContain("Validation len on password failed");
        expect(response.body.firstname).toContain("Le prénom doit contenir entre 2 et 50 caractères");
    });

    test('Request to check if you are authorized to make requests', async () => {
        const response = await request(app).get("/check");

        const login = await request(app).post("/login").send({
            email: 'test@test.com',
            password: 'password'
        });

        const token = login.body.token;

        const authorizedRequest = await request(app).get("/check").set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
        expect(login.status).toBe(200);
        expect(login.body.token).toBeDefined();
        expect(authorizedRequest.status).toBe(200);
    });

    afterAll(async () => {
        await postgres.Credential.destroy({
            where: {},
        })
        await postgres.User.destroy({
            where: {},
        })
        await mongoose.connection.close();
    });
});