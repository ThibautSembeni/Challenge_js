const MongoUser = require('../../db/models/mongo/User');
const mongoose = require('mongoose');
const UniqueConstraintError = require("../../errors/UniqueConstraintError");

module.exports = function UserMongoService() {
    return {
        create: function (data) {
            try {
                return new MongoUser(data).save().then(() => console.log('Enregistrement du user réussi'))
                    .catch(() => console.log('Enregistrement du user échoué'));
            } catch (error) {

            }
        }
    }
}