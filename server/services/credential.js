const { Credential } = require("../db/models/postgres");

module.exports = function CredentialService() {
    return {
        create: async function (data) {
            return Credential.create(data);
        },
        findOne: async function (filters) {
            return Credential.findOne({ where: filters });
        },
        delete: async function (filters) {
            return Credential.destroy({ where: filters });
        },
    };
};