module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
        }
    }

    OrderItem.init(
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
            product: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le produit est obligatoire",
                    },
                },
            },
        },
        { sequelize: connection, tableName: "order_items" }
    );

    return OrderItem;
};
