const { generateVerificationToken } = require("../../utils/user");
const request = require("supertest");
const app = require("../../server");
const postgres = require("../../db/models/postgres");
const mongo = require("../../db/models/mongo");
const mongoose = require('mongoose');

describe('Test register verify account', () => {
	const registerUrl = `/register`
	const verificationUrl = `/verify`

	test('Verify a customer user', async () => {
		const registrationData = {
			firstname: 'John',
			lastname: 'Doe',
			email: 'customer@user.com',
			password: 'password',
		}
		const registerResponse = await request(app).post(registerUrl).send(registrationData);

		const jwtToken = await generateVerificationToken(registerResponse.body);
		const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);

		expect(verificationResponse.status).toBe(302);
	});

	test('Verify status user before verification process', async () => {
		const registrationData = {
			firstname: 'John',
			lastname: 'Doe',
			email: 'status@customer.com',
			password: 'password'
		}
		const registerResponse = await request(app).post(registerUrl).send(registrationData);

		const jwtToken = await generateVerificationToken(registerResponse.body);

		const verificationResponse = await request(app).get(`${verificationUrl}/${jwtToken}`);

		expect(verificationResponse.status).toBe(302);
	});

	afterAll(async () => {
		await postgres.Credential.destroy({
			where: {},
		})
		await postgres.User.destroy({
			where: {},
		})
		await mongo.User.deleteMany({});
		await mongoose.connection.close();
	});
});
