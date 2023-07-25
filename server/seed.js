const sequelizeFixtures = require('sequelize-fixtures');
const db = require('./db/models/postgres');




const models = {
    Transaction: db.Transaction,
    // Add other models if needed
};

sequelizeFixtures.loadFile('./db/fixtures/test_data.json', models)
    .then(() => {
        console.log('Data loaded successfully.');
        // doStuffAfterLoad(); // Your additional tasks here
    })
    .catch((err) => {
        console.error('Error loading fixtures:', err);
    });