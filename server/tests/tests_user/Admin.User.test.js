const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require("mongoose");
const EmailSender = require("../../services/emailSender");
const {
    getUserBody,
    registerUser,
    createAnAdminAccount,
    createRandomUser,
    createRequestToBeMerchant
} = require("./users_utils");
const {generateVerificationToken} = require("../../utils/user");

describe('Tests Admin', () => {
    let headers
    let requestMerchant;
    beforeAll(async () => {
        EmailSender.mailjet = {
            post: jest.fn().mockReturnThis(),
            request: jest.fn().mockResolvedValue({response: {request: {socket: {destroy: jest.fn()}}}})
        };

        requestMerchant= await createRequestToBeMerchant()

        const adminAccount = await createAnAdminAccount()
        const token = generateVerificationToken(adminAccount)
        headers = {
            'Authorization': `Bearer ${token}`,
        };
    });

    test('Admin can get pending merchants list', async () => {
        const listMerchants = await request(app).get('/admin/merchants/pending').set(headers)
        expect(listMerchants.body.length).toBe(1)
    });

    test('Admin valid a request merchant', async () => {
        const merchantId = requestMerchant.id
        const sendCredentialsForMerchantSpy = jest.spyOn(EmailSender, 'sendCredentialsForMerchant');
        const sendDeclineMailSpy = jest.spyOn(EmailSender, 'sendDeclineMail');

        const response = await request(app).get(`/admin/merchants/approve/${merchantId}`).set(headers)

        expect(response.status).toBe(200)
        expect(sendCredentialsForMerchantSpy).toHaveBeenCalled();
        expect(sendDeclineMailSpy).not.toHaveBeenCalled();
    });

    test('Admin decline a request merchant', async () => {
        const merchantId = requestMerchant.id
        const sendCredentialsForMerchantSpy = jest.spyOn(EmailSender, 'sendCredentialsForMerchant');
        const sendDeclineMailSpy = jest.spyOn(EmailSender, 'sendDeclineMail');

        const response = await request(app).get(`/admin/merchants/decline/${merchantId}`).set(headers)

        expect(response.status).toBe(200)
        expect(sendDeclineMailSpy).toHaveBeenCalled();
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
})
;