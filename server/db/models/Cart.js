module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');
    const User = () => require('./User')(connection);
    const Product = () => require('./Product')(connection);

    class Cart extends Model {}

    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "La quantité est obligatoire"
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
    }, { sequelize: connection, tableName: 'carts' });

    Cart.belongsTo(User, { foreignKey: 'user_id', as: 'users' });
    Cart.hasMany(Product, { foreignKey: 'product_id', as: 'products' });

    return Cart;
}