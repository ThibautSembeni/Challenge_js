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
const {generateVerificationToken} = require("../../utils/user");

describe('Tests CRUD READ', () => {
    let headers

    beforeAll(async () => {
        const adminAccount = await createAnAdminAccount()
        const token = await generateVerificationToken(adminAccount)
        headers = {
            'Authorization': `Bearer ${token}`,
        };
    })

    test('Read a user', async () => {
        const user = getUserBody()
        const response = await request(app).post('/register').send(user)
        const responseForRegister = await request(app).get(`/users/${response.body.id}`).set(headers)
        expect(responseForRegister.body.id).toBe(response.body.id)
    });

    test('Read not existing user', async () => {
        const responseForRegister = await request(app).get(`/users/999`).set(headers)
        expect(responseForRegister.status).toBe(404)
    });
})
;
