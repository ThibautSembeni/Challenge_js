const { faker } = require('@faker-js/faker');
//const faker = require('./path/to/fakers.js');

const db = require('./db/models/postgres');
const { Sequelize } = require('sequelize');

// Generate a random name
const name = faker.person.firstName();

// Generate a random email address
const email = faker.internet.email();

const phone = faker.phone.phoneNumber();

const randomBillingInfo = {
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    postalCode: faker.address.zipCode(),
    country: faker.address.country(),
};

const randomShippingInfo = {
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    postalCode: faker.address.zipCode(),
    country: faker.address.country(),
};

const randomCart = [
    { name: faker.commerce.productName(), price: faker.random.number() },
    { name: faker.commerce.productName(), price: faker.random.number() },
];

const randomAmount = faker.random.number();
const randomCurrency = 'eur';
const randomStatus = 'paid';
const randomReference = faker.random.alphaNumeric(20);
const randomCreatedAt = faker.date.past();
const randomUpdatedAt = faker.date.recent();



const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true,
});

db.query('INSERT INTO users (lastname, email, phone, randomBillingInfo, randomShippingInfo, randomCart, randomAmount, randomCurrency, randomStatus, randomReference, randomCreatedAt, randomUpdatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [name, email, phone, randomBillingInfo, randomShippingInfo, randomCart, randomAmount, randomCurrency, randomStatus, randomReference, randomCreatedAt, randomUpdatedAt]);