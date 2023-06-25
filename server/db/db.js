const Sequelize = require('sequelize');

const connection = new Sequelize(process.env.DATABASE_URL)

connection
    .authenticate()
    .then(() => console.log('\u001b[' + 32 + 'm' + `connected to ${process.env.DATABASE_URL.split(":")[0]} database` + '\u001b[0m'))
    .catch((err) => console.log(err));

module.exports = connection;

