module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class PasswordReset extends Model {
        static associate(models) {
            PasswordReset.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }

    PasswordReset.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, { sequelize: connection, tableName: 'reset_password' });


    PasswordReset.addHook('beforeCreate', (reset) => {
        const expirationHour = 24
        const expirationDurationMs = expirationHour * 60 * 60 * 1000;
        const currentTimestamp = new Date().getTime();
        const expirationTimestamp = currentTimestamp + expirationDurationMs;
        reset.expiresAt = new Date(expirationTimestamp);
    });

    return PasswordReset;
};