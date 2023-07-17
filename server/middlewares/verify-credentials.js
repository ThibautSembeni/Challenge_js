module.exports = (req, res, next) => {
    const { client_token, client_secret } = req.headers;
    console.log('req', req.headers)
    if (client_token === 'client_token' && client_secret === 'client_secret') {
        next();
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}