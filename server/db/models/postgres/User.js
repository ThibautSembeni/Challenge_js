module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const bcrypt = require('bcryptjs');
    const mongo = require('../mongo')
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Credential, { foreignKey: 'user_id', as: 'credentials' });
            User.hasMany(models.ResetPassword, { foreignKey: 'user_id', as: 'reset_password' });
            User.hasMany(models.Transaction, { foreignKey: 'merchant_id', as: 'merchantTransactions' }); // changed user_id to merchant_id and 'transactions' to 'merchantTransactions'
        }

        isPasswordValid(password) {
            return bcrypt.compare(password, this.password);
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le nom est obligatoire"
                },
                len: {
                    args: [2, 50],
                    msg: "Le nom doit contenir entre 2 et 50 caractères"
                },
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le prénom est obligatoire"
                },
                len: {
                    args: [2, 50],
                    msg: "Le prénom doit contenir entre 2 et 50 caractères"
                },
            }
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [2, 50],
                    msg: "Le nom de la société doit contenir entre 2 et 50 caractères"
                },
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [10, 10],
                    msg: "Le numéro de téléphone doit contenir 10 chiffres"
                },
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: "L'email est déjà utilisé"
            },
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "L'email doit être valide"
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 32],
                is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                notNull: {
                    msg: "Le mot de passe est obligatoire"
                },
            }
        },
        kbis: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [2, 100],
                    msg: "Le nom du fichier doit contenir entre 2 et 100 caractères"
                },
            }
        },
        confirmation_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cancellation_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        merchant_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payout_currency: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^([E][U][R]|[U][S][D])$/,
                    msg: "La devise doit être EUR ou USD"
                }
            }
        },
        role: {
            type: DataTypes.ENUM,
            values: ['admin', 'merchant', 'customer'],
            defaultValue: 'customer',
            allowNull: false,
            validate: {
                isIn: {
                    args: [['admin', 'merchant', 'customer']],
                    msg: "Le rôle doit être admin, merchant ou customer"
                }
            }
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pending', 'approved', 'declined'],
            defaultValue: 'pending',
            allowNull: false,
        },
    }, { sequelize: connection, tableName: 'users' });

    function updatePassword(user) {
        return bcrypt.genSalt(10).then((salt) => bcrypt.hash(user.password, salt).then((hash) => { user.password = hash; }))
    }

    User.addHook("beforeCreate", async (user) => {
        if (user.dataValues.hasOwnProperty('kbis')) {
            user.role = 'merchant';
        }
        return updatePassword(user);
    });

    User.addHook("beforeUpdate", async (user, options) => {
        if (options.fields.includes("password")) {
            return updatePassword(user);
        }
    });

    // Pour le projet et la synchro avec mongo 
    User.addHook("afterCreate", (user) => {
        mongo.User.create(user.dataValues).catch((error) => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                console.log('duplicate key error');
            }
        });
    });

    return User;
};