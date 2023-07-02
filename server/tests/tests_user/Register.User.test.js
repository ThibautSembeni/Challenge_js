const request = require("supertest");
const app = require("../../server");
const db = require("../../db/index");

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

        expect(response.status).toBe(500);
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

        expect(response.status).toBe(500);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.email).toContain("L'email doit être valide");
    });

    test('Register with incorrect password', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(500);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.password).toContain("Validation len on password failed");
    });

    test('Register with multiple incorrect field', async () => {
        const registrationData = {
            firstname: 'f',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await request(app).post(target).send(registrationData);

        expect(response.status).toBe(500);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.password).toContain("Validation len on password failed");
        expect(response.body.errors.firstname).toContain("Le prénom doit contenir entre 2 et 50 caractères");
    });

    afterAll(() => {
        return db.User.destroy({
            where: {},
        })
    });
});