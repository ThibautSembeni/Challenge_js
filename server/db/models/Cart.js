module.exports = (connection) => {
    const { DataTypes, Model } = require('sequelize');

    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            Cart.hasMany(models.Product, { foreignKey: 'cart_id', as: 'products' });
        }
    }

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
        }
    }, { sequelize: connection, tableName: 'carts' });

    return Cart;
};