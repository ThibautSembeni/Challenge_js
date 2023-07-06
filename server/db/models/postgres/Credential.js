module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const bcrypt = require('bcryptjs');

    class Credential extends Model {
        static associate(models) {
            Credential.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }

    Credential.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        client_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        client_secret: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, { sequelize: connection, tableName: 'credentials' });

    function generateToken() {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(Date.now().toString(), salt);
    }

    Credential.addHook('beforeCreate', async (credential) => {
        credential.client_token = generateToken();
        credential.client_secret = generateToken();
    });

    return Credential;
};