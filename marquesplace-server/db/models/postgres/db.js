const Sequelize = require('sequelize');

const connection = new Sequelize(process.env.DATABASE_URL_FRONT, { logging: false })

if (process.env.NODE_ENV === 'test') {
    connection
        .authenticate()
} else {
    const retryConnection = () => {
        connection
            .authenticate()
            .then(() => console.log('\u001b[' + 32 + 'm' + `connected to ${process.env.DATABASE_URL.split(":")[0]} database` + '\u001b[0m'))
            .catch((err) => {
                // console.log(err);
                if (err.name === 'SequelizeConnectionRefusedError' || err.name === 'SequelizeHostNotFoundError' || err.name === 'SequelizeHostNotReachableError' || err.name === 'SequelizeInvalidConnectionError' || err.name === 'SequelizeConnectionTimedOutError') {
                    console.log('\u001b[1;' + 31 + 'm' + 'not conneted to the database' + '\u001b[0m');
                    console.log('\u001b[1;' + 31 + 'm' + 'new connexion in 5 seconds...' + '\u001b[0m');
                    new Promise((resolve) => setTimeout(resolve, 5000)).then(retryConnection);
                }
            });
    }

    retryConnection();
}

module.exports = connection;
