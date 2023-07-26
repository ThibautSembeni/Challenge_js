module.exports = function TransactionController(Service) {
    return {
        createTransaction: async (req, res, next) => {
            try {
                const response = await Service.createTransaction(req.body);
                res.status(201).send(response);
            } catch (error) {
                next(error);
            }
        },

        updateTransaction: async (req, res, next) => {
            try {
                const transaction = await Service.updateTransaction(req.params.reference, req.body);
                res.status(200).send(transaction);
            } catch (error) {
                next(error);
            }
        },

        getTransaction: async (req, res, next) => {
            try {
                const transaction = await Service.getTransaction(req.params.reference);
                res.status(200).send(transaction);
            } catch (error) {
                next(error);
            }
        },

        getAllTransactions: async (req, res, next) => {
            try {
                const transactions = await Service.getAllTransactions();
                res.status(200).send(transactions);
            } catch (error) {
                next(error);
            }
        },




        createOperation: async (req, res, next) => {
            try {
                const operation = await Service.create(req.body);
                res.status(201).send(operation);
            } catch (error) {
                next(error);
            }
        },

        updateOperation: async (req, res, next) => {
            try {
                const operation = await Service.update(req.params.id, req.body);
                res.status(200).send(operation);
            } catch (error) {
                next(error);
            }
        },

        getOperation: async (req, res, next) => {
            try {
                const operation = await Service.get(req.params.id);
                res.status(200).send(operation);
            } catch (error) {
                next(error);
            }
        },

        getAllOperations: async (req, res, next) => {
            try {
                const operations = await Service.getAll();
                res.status(200).send(operations);
            } catch (error) {
                next(error);
            }
        },
    };
};