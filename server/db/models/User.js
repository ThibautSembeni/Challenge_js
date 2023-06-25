module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const bcrypt = require('bcryptjs');

    class User extends Model {

        isPasswordValid(password) {
            return bcrypt.compare(password, this.password);
        }
    }

    User.init({
        lastname: DataTypes.STRING,
        firstname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // len: [8, 32],
                // is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                len: [1, 32],
            }
        }
    }, { sequelize: connection, tableName: 'users' });

    function updatePassword(user) {
        return bcrypt.genSalt(10).then((salt) => bcrypt.hash(user.password, salt).then((hash) => { user.password = hash; }))
    }

    User.addHook("beforeCreate", async (user) => {
        return updatePassword(user);
    });
    User.addHook("beforeUpdate", async (user, options) => {
        if (options.fields.includes("password")) {
            return updatePassword(user);
        }
    });
    // Pour le projet et la synchro avec mongo 
    // User.addHook("afterCreate", (user) => {
    //     bcrypt.genSalt(10).then((salt) => bcrypt.hash(user.password, salt).then((hash) => { user.password = hash; }))
    // });

    return User;
};