const { DataTypes } = require("sequelize");
module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    function uniqueRef() {
        let code = 'prod_';
        let authorizedChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 20; i++) {
            code += authorizedChar.charAt(Math.floor(Math.random() * authorizedChar.length));
        }
        return code;
    }
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cart_items' });
        }
    }

    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le nom est obligatoire"
                },
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le prix est obligatoire"
                },
            }
        },
        reference: {
            type: DataTypes.STRING,
            defaultValue: () => uniqueRef(),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "La référence est obligatoire"
                },
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notNull: {
                    msg: "Le stock est obligatoire"
                }
            }
        }
    }, { sequelize: connection, tableName: 'products' });

    return Product;
};