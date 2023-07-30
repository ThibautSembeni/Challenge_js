const app = require("../../server");

const request = require("supertest");
const {generateRandomString} = require("../tests_utils");

const target = '/register';

function getUserBody() {
    return {
        password: generateRandomString(10),
        email: generateRandomString(8) + '@example.com',
        lastname: generateRandomString(8),
        firstname: generateRandomString(6),
    }

}

async function registerUser(registrationData) {
    return await request(app).post(target).send(registrationData)
}

async function getRandomUser() {
    const userBody = getUserBody()
    const user = await registerUser(userBody)
    return user.body
}

module.exports = {
    getRandomUser,
    getUserBody,
    registerUser
};