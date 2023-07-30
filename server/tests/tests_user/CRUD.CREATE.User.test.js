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

describe('Tests Admin', () => {
    let headers
    let userAlreadyExit

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

    test('Create user', async () => {
        const user =  getUserBody()
        const response = await request(app).post('/register').send(user)
        userAlreadyExit = user
        expect(response.status).toBe(201)
    });

    test('Create user already exist', async () => {
        const responseRegister = await request(app).post('/register').send(userAlreadyExit)
        console.log(responseRegister.body)
        expect(responseRegister.status).toBe(409)
    });

    test('Create user missing field', async () => {
        const user =  getUserBody()
        delete user.email
        const responseRegister = await request(app).post('/register').send(user)

        expect(responseRegister.status).toBe(422)
        expect(responseRegister.body.email).toBeDefined()
        expect(responseRegister.body.email).toContain('User.email cannot be null')
    });

    test('Create user with inccoret value field', async () => {
        const user =  getUserBody()
        user.email = "azert"
        const responseRegister = await request(app).post('/register').send(user)

        expect(responseRegister.status).toBe(422)
        expect(responseRegister.body.email).toBeDefined()
        expect(responseRegister.body.email).toContain("L\'email doit être valide")
    });
})
;