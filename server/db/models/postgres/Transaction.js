const { DataTypes } = require("sequelize");
module.exports = (connection) => {
  const mongo = require("../mongo");
  const { DataTypes, Model } = require("sequelize");
  const { User } = require("../postgres");
  function uniqueRef() {
    let code = "tr_";
    let authorizedChar =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 20; i++) {
      code += authorizedChar.charAt(
        Math.floor(Math.random() * authorizedChar.length)
      );
    }
    return code;
  }

  let updateInProgress = false;
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'merchant_id', as: 'merchant' });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reference: {
        type: DataTypes.STRING,
        defaultValue: () => uniqueRef(),
        allowNull: false,
        validate: {
          notNull: {
            msg: "La référence est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "transactions" }
  );

  Transaction.addHook("afterCreate", async (transaction) => {
    // const user = db.User.findOne({ where: { id: transaction.merchant_id } })
    // console.log(User, transaction);
    mongo.Transaction.create({
      transaction_reference: transaction.reference, transaction_id: transaction.id, status: "created", merchant: transaction.merchant
    }).catch((error) => {
      if (error.name === "MongoServerError" && error.code === 11000) {
        console.log("duplicate key error");
      }
    });
  });

  return Transaction;
};
