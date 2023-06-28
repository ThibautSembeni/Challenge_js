module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const bcrypt = require('bcryptjs');
    const Cart = () => require('./Cart')(connection);
    const Credential = () => require('./Credential')(connection);
    const Transaction = () => require('./Transaction')(connection);
    const Operation = () => require('./Operation')(connection);

    class User extends Model {
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
                    msg: "Le nom du fichier doit contenir entre 2 et 50 caractères"
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
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
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
    }, { sequelize: connection, tableName: 'users' });

    User.hasMany(Credential, { foreignKey: 'user_id', as: 'credentials' });
    User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
    User.hasMany(Operation, { foreignKey: 'user_id', as: 'operations' });
    User.hasMany(Cart, { foreignKey: 'user_id', as: 'carts' });

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