module.exports = function transactionController(transactionService, options = {}) {
    let result = {
        getAll: async (req, res) => {
            const { page, itemPerPage, order, ...filters } = req.query;
            try {
                const results = await transactionService.findAll(filters, { order, limit: itemPerPage, offset: (page - 1) * itemPerPage });
                res.json(results);
            } catch (error) {
                res.status(500).json(error);
            }

        },
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
        create: async (req, res) => {
            const { body } = req;
            try {
                const result = await transactionService.create(body);
                res.status(201).json(result);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    res.status(500).json(error);
                }
            }
        },
        replace: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [[result, created]] = await transactionService.replace({ id: parseInt(id, 10) }, { id: parseInt(id, 10), ...body });
                if (created) res.status(201).json(result);
                else res.json(result);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    res.status(500).json(error);
                }
            }
        },
        update: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [result] = await transactionService.update({ id: parseInt(id, 10) }, body);
                if (result) res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    res.status(500).json(error);
                }
            }
        },
        delete: async (req, res) => {
            const { id } = req.params;
            try {
                const nbDeleted = await transactionService.delete({ id: parseInt(id, 10) });
                if (nbDeleted) res.sendStatus(204);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
    }

    if (options.hasOwnProperty('customController')) {
        result = { ...result, ...options.customController(transactionService) }
    }

    return result;
}