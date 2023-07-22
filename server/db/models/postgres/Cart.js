module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'cart_items' });
        }
    }

    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Le prix total est obligatoire"
                },
            }
        },
    }, { sequelize: connection, tableName: 'carts' });

    return Cart;
};