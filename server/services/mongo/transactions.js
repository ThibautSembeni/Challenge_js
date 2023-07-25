const { mongoDB } = require('../../db/models/mongo');


module.exports = function TransactionMongoService() {
    return {
        getTransactionsVolumeByDays: async (data) => {
            return new Promise(async (resolve, reject) => {
                await mongoDB.Transaction.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(data.start_date),
                                $lte: new Date(data.end_date),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$createdAt",
                                },
                            },
                            total: { $sum: "$amount" },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ])
                    .then((transactions) => {
                        resolve(transactions);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
}