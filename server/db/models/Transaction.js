module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const User = () => require('./User')(connection);
    const Operation = () => require('./Operation')(connection);
    const Notification = () => require('./Notification')(connection);

    class Transaction extends Model {}

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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    }, { sequelize: connection, tableName: 'transactions' });

    Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'users' });
    Transaction.hasMany(Operation, { foreignKey: 'transaction_id', as: 'operations' });
    Transaction.hasMany(Notification, { foreignKey: 'transaction_id', as: 'notifications' });

    return Transaction;
};