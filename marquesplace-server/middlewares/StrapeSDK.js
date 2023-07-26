module.exports = function (credentials) {
    this.createTransaction = async (payload) => {
        const response = await fetch(`${process.env.API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Public-Key': credentials.client_token,
                'X-Secret-Key': credentials.client_secret
            },
            body: JSON.stringify(payload)
        })
        return [response.status, await response.json()]
    }
    this.getAllTransaction = async (payload) => {
        const response = await fetch(`${process.env.API_URL}/transactions`, {
            method: 'GET',
            headers: {
                'X-Public-Key': credentials.client_token,
                'X-Secret-Key': credentials.client_secret
            },
        })
        return [response.status, await response.json()]
    }
    this.refundTransaction = async (payload) => {
        // Not implemented
        // console.log("refundTransaction", payload)
    }
    return (req, res, next) => {
        next()
    }
};