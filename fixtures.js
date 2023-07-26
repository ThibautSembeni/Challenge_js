const {faker} = require('@faker-js/faker');
const { QueryTypes } = require('sequelize');
const db = require('./db/models/postgres');

const roles = ['admin', 'merchant', 'customer'];

const generateRandomUser = async () => {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const company = faker.company.buzzPhrase();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = roles[Math.floor(Math.random() * roles.length)];
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();

    await db.User.create({
        firstname,
        lastname,
        company,
        email,
        password,
        role,
        createdAt,
        updatedAt,
    });
};

const fixturesLoader = async () => {
    try {
        //await db.sync(); // Sync the database

        for (let i = 0; i < 50; i++) {
            await generateRandomUser();
        }

        console.log('50 random users created successfully!');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        process.exit(1);
    }
};

fixturesLoader();