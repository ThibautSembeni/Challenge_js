module.exports = function (credentials) {
    this.createTransaction = async (payload) => {
        try {
            const response = await fetch(`http://node:3000/eventPayment/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Public-Key': credentials.client_token,
                    'X-Secret-Key': credentials.client_secret,
                    'Origin': process.env.FRONT_URL,
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error(`Strape error: ${error}`);
        }

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