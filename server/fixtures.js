const { faker } = require('@faker-js/faker');
const { QueryTypes } = require('sequelize');
const db = require('./db/models/postgres');



const generateRandomUser = async () => {
    const product_name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const reference = faker.string.alphanumeric(15);
    const stock = faker.string.numeric(2);
    const status = "active"
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();
    const merchantId = 1

    await db.Product.create({
        product_name,
        description,
        price,
        reference,
        stock,
        status,
        createdAt,
        updatedAt,
        merchantId
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