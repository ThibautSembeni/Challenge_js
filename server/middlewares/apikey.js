const validApiKeys = ['1', '2'];

function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(401).json({ message: 'Invalid API key' });
    }

    next();
}

module.exports = apiKeyMiddleware;