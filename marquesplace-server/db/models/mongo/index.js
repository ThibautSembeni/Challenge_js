const connection = require('./db');
const fs = require('fs');
const path = require('path');
const db = { connection };


const files = fs.readdirSync(path.join(__dirname));
files.filter((file) => file !== 'db.js' && file !== 'index.js').forEach(file => {
    const model = require(path.join(__dirname, file));
    db[file.split('.')[0]] = model;
});

module.exports = db;