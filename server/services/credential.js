const { Credential } = require("../db/models/postgres");

module.exports = function CredentialService() {
    return {
        findOne: async function (filters) {
            return Credential.findOne({ where: filters });
        },
    };
};