const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require("mongoose");
const EmailSender = require("../../services/emailSender");
const {generateUser, registerUser, createRandomUser, getUserBody} = require("./users_utils");
const {response} = require("express");

describe('Test register', () => {
    EmailSender.mailjet = {
        post: jest.fn().mockReturnThis(),
        request: jest.fn().mockResolvedValue({response: {request: {socket: {destroy: jest.fn()}}}})
    };


    test('Forgot Password for an existing user', async () => {
        const target = '/forgot-password';
        const user = await createRandomUser()
        const sendForgotPasswordEmailSpy = jest.spyOn(EmailSender, 'sendForgotPasswordEmail');

        const response = await request(app).post(target).send(user)

        expect(response.status).toBe(200);
        expect(sendForgotPasswordEmailSpy).toHaveBeenCalled();
    });

    test('Forgot Password for an not existing user', async () => {
        const target = '/forgot-password';

        const response = await request(app).post(target).send({})

        expect(response.status).toBe(422);
    });

    test('Change Password for an existing user', async () => {
        const target = '/forgot-password';
        const user = getUserBody()
        const response =  await request(app).post('/register').send(user)

        const forgotPasswordResponse = await request(app).post(target).send(user)

        expect(forgotPasswordResponse.status).toBe(200);

        const params = EmailSender.sendForgotPasswordEmail.mock.calls[0];
        const resetPasswordURL = params[1]
        const urlSegments = resetPasswordURL.split('/');
        const token = urlSegments[urlSegments.length - 1];

        const changePasswordBody = {
            newPassword: 'newPassword',
            confirmNewPassword: 'newPassword',
        }
        const changePasswordResponse = await request(app).post(`/reset-password/${token}`).send(changePasswordBody)

        expect(changePasswordResponse.status).toBe(200)
    });






    // afterAll(async () => {
    //     await postgres.Credential.destroy({
    //         where: {},
    //     });
    //     await postgres.User.destroy({
    //         where: {},
    //     });
    //     await mongo.User.deleteMany({});
    //     await mongoose.connection.close();
    // });
});