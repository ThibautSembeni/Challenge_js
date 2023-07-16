const mongoose = require('mongoose');

let connection;
if (process.env.NODE_ENV === 'test') {
    connection = mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
    connection = mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('\u001b[' + 32 + 'm' + `connected to ${process.env.MONGO_URL.split(":")[0]} database` + '\u001b[0m'))
        .catch((err) => console.log(err))
}
module.exports = connection;