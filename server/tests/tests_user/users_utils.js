const app = require("../../server");
const userService = require("../../services/user");
const postgres = require("../../db/models/postgres");

const request = require("supertest");
const { generateRandomString } = require("../tests_utils");
const { generateVerificationToken } = require("../../utils/user");

const target = '/register';

function getUserBody() {
    return {
        password: generateRandomString(10),
        email: generateRandomString(8) + '@example.com',
        lastname: generateRandomString(8),
        firstname: generateRandomString(6),
        isActive: true
    }

}

async function registerUser(registrationData) {
    return await request(app).post(target).send(registrationData)
    // const user = await postgres.User.create(registrationData)
    return user
}


async function createAnAdminAccount() {
    const body = getUserBody()
    body.role = 'admin'
    const UserService = userService()
    return await UserService.create(body)
}

async function createRandomUser() {
    const userBody = getUserBody()
    const user = await registerUser(userBody)
    // return user.body
    return user
}

async function createRequestToBeMerchant() {
    const verificationUrl = `/merchant/demand/update`
    const userBody = await createRandomUser()
    const jwtToken = await generateVerificationToken(userBody);
    const encodedToken = Buffer.from(jwtToken).toString('base64url');

    const confirmationBody = {
        kbis: 'kbis',
        company: 'company',
        phone_number: '0102030405',
        confirmation_url: 'confirmation_url',
        cancellation_url: 'cancellation_url',
        merchant_url: 'merchant_url',
        payout_currency: 'EUR',
    }

    const verificationResponse = await request(app).post(`${verificationUrl}/${encodedToken}`).send(confirmationBody);
    return verificationResponse.body
}


module.exports = {
    createRandomUser,
    getUserBody,
    registerUser,
    createAnAdminAccount,
    createRequestToBeMerchant
};