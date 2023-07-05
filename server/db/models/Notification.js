module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
        }
    }
    
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

    return Notification;
};