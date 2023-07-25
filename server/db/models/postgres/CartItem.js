module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");

  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: "cart_id", as: "cart" });
    }
  }

  CartItem.init(
    {
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
            msg: "La quantité est obligatoire",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le prix est obligatoire",
          },
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le produit est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "cart_items" }
  );

  return CartItem;
};
