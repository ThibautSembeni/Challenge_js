const { faker } = require('@faker-js/faker');
const { QueryTypes } = require('sequelize');
const db = require('./db/models/postgres');

// Generate a random name
const firstname = faker.person.firstName();

const lastname = faker.person.firstName();

const company = faker.company.buzzPhrase();

// Generate a random email address
const email = faker.internet.email();

const password = faker.internet.password();

const role = 'admin';

const clientInfo = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),

}



const randomBillingInfo = {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
};

const randomShippingInfo = {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
};

const randomCart = [
    { name: faker.commerce.product(), price: faker.string.numeric() },
    { name: faker.commerce.product(), price: faker.string.numeric() },
];
//
const randomAmount = faker.string.numeric();
const randomCurrency = 'eur';
const randomStatus = 'paid';
const randomReference = faker.string.alphanumeric(20);
const createdAt = faker.date.past();
const updatedAt = faker.date.recent();



/*const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true,
});*/

/*db.query('INSERT INTO users (lastname, firstname, company, email, password, role, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    {
    bind: [lastname, firstname, company, email, password, role, randomCreatedAt, randomUpdatedAt], type: QueryTypes.INSERT
    });*/

const fixturesLoader = async () => {
        await db.User.create({ lastname, firstname, company, email, password, role });
        await db.Transaction.create({clientInfo, randomCart, randomShippingInfo ,randomBillingInfo, randomAmount, randomCurrency, randomStatus, randomReference, createdAt, updatedAt });

        process.exit(1)
}

fixturesLoader()