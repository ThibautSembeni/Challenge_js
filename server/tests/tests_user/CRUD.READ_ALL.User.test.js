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

describe('Tests CRUD READ ALL', () => {
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
        };
    })

    test('Create 5 users', async () => {
        for (let i = 0; i < 5; i++) {
            const userBody = getUserBody()
            const registerResponse = await request(app).post(`/register`).send(userBody);
        }
        const response = await request(app).get('/users').set(headers)
        expect(response.body.length).toBe(6)
    });
})
;