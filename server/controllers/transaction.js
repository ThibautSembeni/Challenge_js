module.exports = function transactionController(transactionService, options = {}) {
    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                const transaction = await transactionService.findOne({ reference: reference })
                if (transaction) {
                    res.json(transaction)
                } else {
                    res.status(404).json({ error: "Transaction not found" })
                }
            } catch (e) {
                next(e)
            }
        },
        getTransactionsByUserId: async (req, res, next) => {
            try {
                const id = req.params.id
                const results = await transactionService.findAll( { user_id: id } )
                if (results) {
                    res.json(results)
                } else {
                    res.status(404).json({ error: "Transaction not found" })
                }
            } catch (e) {
                next(e)
            }
        }
    }

    if (options.hasOwnProperty('customController')) {
        result = { ...result, ...options.customController(transactionService) }
    }

    return result;
}