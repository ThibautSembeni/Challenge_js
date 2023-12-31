module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

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
    }, { sequelize: connection, tableName: 'notifications' });

    return Notification;
};