const connection = require('./db');
const mongoConnection = require('./mongo');
const fs = require('fs');
const path = require('path');
const db = { connection };
const mongoDB = { mongoConnection };

const User = require('./models/mongo/User');

const files = fs.readdirSync(path.join(__dirname, "models", "postgres"));
files.forEach(file => {
    const model = require(path.join(__dirname, "models", "postgres", file))(connection);
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

const mongoFiles = fs.readdirSync(path.join(__dirname, "models", "mongo"));
mongoFiles.forEach(file => {
    const model = require(path.join(__dirname, "models", "mongo", file));
    mongoDB[file.split('.')[0]] = model;
});

module.exports = { db, mongoDB };