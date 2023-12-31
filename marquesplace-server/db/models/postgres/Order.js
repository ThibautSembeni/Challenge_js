module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }

    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "L'utilisateur est obligatoire",
                    },
                },
            },
            total_price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le prix total est obligatoire",
                    },
                },
            },
            reference: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le status est obligatoire",
                    },
                },
            },
        },
        { sequelize: connection, tableName: "orders" }
    );

    return Order;
};
