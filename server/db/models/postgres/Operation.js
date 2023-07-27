module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Operation extends Model {

    }

    Operation.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            transaction_reference: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        { sequelize: connection, tableName: "operations" }
    );

    return Operation;
};
