module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Impersonation extends Model {}

    Impersonation.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        merchantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, { sequelize: connection, tableName: 'impersonations' });

    return Impersonation;
};
