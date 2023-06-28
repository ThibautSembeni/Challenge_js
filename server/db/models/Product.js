module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const Cart = () => require('./Cart')(connection);

    class Product extends Model {}

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
    }, { sequelize: connection, tableName: 'products' });

    Product.belongsTo(Cart, { foreignKey: 'cart_id', as: 'carts' });

    return Product;
};