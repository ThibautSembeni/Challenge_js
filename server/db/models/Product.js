module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
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
        }
    }, { sequelize: connection, tableName: 'products' });

    return Product;
};