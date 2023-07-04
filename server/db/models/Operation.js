module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    
    class Operation extends Model {
        static associate(models) {
            Operation.belongsTo(models.Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
        }
    }

    Operation.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['capture', 'refund'],
            allowNull: false,
            defaultValue: 'capture',
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le montant est obligatoire"
                },
            }
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "La devise est obligatoire"
                },
            }
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pending', 'succeeded', 'failed'],
            allowNull: false,
            defaultValue: 'pending',
        },
    }, { sequelize: connection, tableName: 'operations' });

    return Operation;
};