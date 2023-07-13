module.exports = function OperationController(OperationService, options = {}) {
    let result = {
        getAll: async (req, res) => {
            const { page, itemPerPage, order, ...filters } = req.query;
            try {
                const results = await OperationService.findAll(filters, { order, limit: itemPerPage, offset: (page - 1) * itemPerPage });
                res.json(results);
            } catch (error) {
                console.error(error);

                res.status(500).json(error);
            }
        },
        getOne: async (req, res) => {
            const { id } = req.params;
            try {
                const result = await OperationService.findOne({ id: parseInt(id, 10) });
                if (result)
                    res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);

                res.status(500).json(error);
            }
        },
        create: async (req, res) => {
            const { body } = req;
            try {
                const result = await OperationService.create(body);
                res.status(201).json(result);
            } catch (error) {
                if (error.constructor.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                }
                else if (error.constructor.name === 'UniqueConstraintError') {
                    res.status(409).json(error.errors);
                }
                else {
                    console.error(error);
                    res.status(500).json(error);
                }
            }
        },
        replace: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [[result, created]] = await OperationService.replace({ id: parseInt(id, 10) }, { id: parseInt(id, 10), ...body });
                if (created) res.status(201).json(result);
                else res.json(result);
            } catch (error) {
                if (error.constructor.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);

                    res.status(500).json(error);
                }
            }
        },
        update: async (req, res) => {
            const { id } = req.params;
            const { body } = req;
            try {
                const [result] = await OperationService.update({ id: parseInt(id, 10) }, body);
                if (result) res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                if (error.constructor.name === 'ValidationError') {
                    res.status(422).json(error.errors);
                } else {
                    console.error(error);

                    res.status(500).json(error);
                }
            }
        },
        delete: async (req, res) => {
            const { id } = req.params;
            try {
                const nbDeleted = await OperationService.delete({ id: parseInt(id, 10) });
                if (nbDeleted) res.sendStatus(204);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
        capture: async (req, res, next) => {
            const { transaction_id } = req.params;
            try {
                const result = await OperationService.capture({ transaction_id: parseInt(transaction_id, 10) });
                if (result) res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                next(error);
            }
        },
        refund: async (req, res, next) => {
            const { transaction_id } = req.params;
            try {
                const result = await OperationService.refund({ transaction_id: parseInt(transaction_id, 10) });
                if (result) res.json(result);
                else res.sendStatus(404);
            } catch (error) {
                next(error);
            }
        }
    }

    if (options.hasOwnProperty('customController')) {
        result = { ...result, ...options.customController(OperationService) }
    }

    return result;
}