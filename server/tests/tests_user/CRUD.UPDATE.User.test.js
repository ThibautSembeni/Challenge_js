const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require("mongoose");
const EmailSender = require("../../services/emailSender");
const {
    createAnAdminAccount,
    createRandomUser, getUserBody
} = require("./users_utils");
const { generateVerificationToken } = require("../../utils/user");

describe('Tests Admin', () => {
    let headers

    beforeAll(async () => {
        await postgres.Credential.destroy({
            where: {},
        });
        await postgres.User.destroy({
            where: {},
        });
        const adminAccount = await createAnAdminAccount()
        const token = await generateVerificationToken(adminAccount)
        headers = {
            'Authorization': `Bearer ${token}`,
            'Cookie': [`token=${token}; httpOnly`]
        };
    })

    test('replace user', async () => {
        const user = getUserBody()
        const response = await request(app).post('/register').send(user)
        expect(response.status).toBe(201)
        const updatedUser = getUserBody()
        const result = await request(app).put(`/users/${response.body.id}`).send(updatedUser)
        expect(result.status).toBe(200)
        expect(result.body.email).toBe(updatedUser.email)
        expect(result.body.lastname).toBe(updatedUser.lastname)
        expect(result.body.firstname).toBe(updatedUser.firstname)
    });

    test('replace not existing user', async () => {
        const updatedUser = getUserBody()
        const result = await request(app).put(`/users/999`).send(updatedUser)
        expect(result.status).toBe(201)
        expect(result.body.email).toBe(updatedUser.email)
        expect(result.body.lastname).toBe(updatedUser.lastname)
        expect(result.body.firstname).toBe(updatedUser.firstname)
    });

    test('update parially user', async () => {
        const user = getUserBody()
        const response = await request(app).post('/register').send(user)
        expect(response.status).toBe(201)
        const bodyForUpdateUser = { email: 'update@parially.user' }
        const result = await request(app).patch(`/users/${response.body.id}`).send(bodyForUpdateUser)
        expect(result.status).toBe(200)
        expect(result.body.email).toBe(bodyForUpdateUser.email)
    });

    test('replace user with missing field', async () => {
        const user = getUserBody()
        const response = await request(app).post('/register').send(user)
        expect(response.status).toBe(201)
        const updatedUser = getUserBody()
        delete updatedUser.lastname
        const result = await request(app).put(`/users/${response.body.id}`).send(updatedUser)
        expect(result.status).toBe(422)
        expect(result.body.lastname).toBeDefined()
        expect(result.body.lastname).toContain('Le nom est obligatoire')
    });
})
    ;