module.exports = (connection) => {
  const mongo = require("../mongo");
  const { DataTypes, Model } = require("sequelize");

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

  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Transaction.belongsTo(models.User, {
        foreignKey: "merchant_id",
        as: "merchant",
      });
      Transaction.hasMany(models.TransactionHistory, {
        foreignKey: "transaction_id",
        as: "transaction_history",
      });
      Transaction.hasMany(models.Operation, {
        foreignKey: "transaction_ref",
        as: "operations",
        targetKey: "reference",
      });
      Transaction.hasMany(models.Notification, {
        foreignKey: "transaction_id",
        as: "notifications",
      });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_info: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Les informations du client sont obligatoires",
          },
        },
      },
      billing_info: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Les informations de facturation sont obligatoires",
          },
        },
      },
      shipping_info: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Les informations de livraison sont obligatoires",
          },
        },
      },
      cart: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Les informations du panier sont obligatoires",
          },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le montant est obligatoire",
          },
        },
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "La devise est obligatoire",
          },
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          "created",
          "captured",
          "cancelled",
          "waiting_refund",
          "partially_refunded",
          "refunded",
          "failed",
        ],
        defaultValue: "created",
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le statut est obligatoire",
          },
        },
      },
      reference: {
        type: DataTypes.STRING,
        defaultValue: () => uniqueRef(),
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "La référence est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "transactions" }
  );

  Transaction.addHook("afterCreate", (transaction) => {
    mongo.Transaction.create(transaction.dataValues).catch((error) => {
      if (error.name === "MongoServerError" && error.code === 11000) {
        console.log("duplicate key error");
      }
    });
  });

  return Transaction;
};
