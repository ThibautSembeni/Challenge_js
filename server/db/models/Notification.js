module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const Transaction = () => require('./Transaction')(connection);

    class Notification extends Model {}
    
    Notification.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        psp_info: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Les informations du PSP sont obligatoires"
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
    }, { sequelize: connection, tableName: 'notifications' });

    Notification.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transactions' });

    return Notification;
};