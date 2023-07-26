const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const credentialController = require("../controllers/credential");
const CredentialService = require("../services/credential");

module.exports = new genericRouter(
    new genericController(
        new CredentialService(),
        {
            customController: credentialController,
        }
    ),
    {
        customRoutes: [
            { handler: 'verify', method: 'post', path: '/verify', middleware: [] },
            { handler: 'regenerate', method: 'get', path: '/regenerate', middleware: [] },
        ],

        defaultRoutes: false,
        middlewares: []
    }
);