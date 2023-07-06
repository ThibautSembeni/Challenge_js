const MongoUser = require('../../db/models/mongo/User');
const mongoose = require('mongoose');
const UniqueConstraintError = require("../../errors/UniqueConstraintError");

module.exports = function UserMongoService() {
    return {
        create: (data) => {
            try {
                new MongoUser(data).save().then(() => console.log('Enregistrement du user réussi'))
                    .catch((error) => console.log(error));
            } catch (error) {
            }
        }
    }
}