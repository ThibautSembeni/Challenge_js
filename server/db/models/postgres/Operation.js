module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Operation extends Model {
        static associate(models) {
            Operation.hasMany(models.Event, { foreignKey: 'aggregate_id', as: 'events' });
        }
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
            },
            type: {
                type: DataTypes.ENUM,
                values: ["capture", "refund"],
                allowNull: false,
                defaultValue: "capture",
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
                values: ["created", "processing", "done"],
                allowNull: false,
                defaultValue: "created",
            },
        },
        { sequelize: connection, tableName: "operations" }
    );

    return Operation;
};
