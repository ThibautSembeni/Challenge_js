module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");

  class OperationHistory extends Model {
    static associate(models) {
      OperationHistory.belongsTo(models.Operation, {
        foreignKey: "operation_id",
        as: "operation",
      });
    }
  }

  OperationHistory.init(
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
            msg: "Le statut de l'opération est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "operation_history" }
  );

  return OperationHistory;
};
