module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Transaction extends Model {
        static associate(models) {
            Transaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            Transaction.hasMany(models.Operation, { foreignKey: 'transaction_id', as: 'operations' });
            Transaction.hasMany(models.Notification, { foreignKey: 'transaction_id', as: 'notifications' });
        }
    }

    Transaction.init({
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
                    msg: "Les informations du client sont obligatoires"
                },
            }
        },
        billing_info: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Les informations de facturation sont obligatoires"
                },
            }
        },
        shipping_info: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Les informations de livraison sont obligatoires"
                },
            }
        },
        cart: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Les informations du panier sont obligatoires"
                },
            }
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
            values: ['pending', 'paid', 'failed'],
            defaultValue: 'pending',
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le statut est obligatoire"
                },
            }
        },
    }, { sequelize: connection, tableName: 'transactions' });

    return Transaction;
};