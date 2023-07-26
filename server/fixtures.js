const { faker } = require('@faker-js/faker');
const { QueryTypes } = require('sequelize');
const db = require('./db/models/postgres');

const randomMerchantId = [1, 2, 3, 4, 5];

const generateRandomUser = async () => {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.number.int({ min: 10, max: 500 });
    const reference = faker.string.alphanumeric(15);
    const stock = faker.number.int({ min: 10, max: 500 });
    const status = "active"
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();
    const merchant_id = randomMerchantId[Math.floor(Math.random() * randomMerchantId.length)];

    await db.Product.create({
        name,
        description,
        price,
        reference,
        stock,
        status,
        createdAt,
        updatedAt,
        merchant_id
    });
};

const fixturesLoader = async () => {
    try {
        //await db.sync(); // Sync the database

        for (let i = 0; i < 20; i++) {
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