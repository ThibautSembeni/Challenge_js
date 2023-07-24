module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");

  class TransactionHistory extends Model {
    static associate(models) {
      TransactionHistory.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
    }
  }

  TransactionHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le statut de la transaction est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "transaction_history" }
  );

  return TransactionHistory;
};
