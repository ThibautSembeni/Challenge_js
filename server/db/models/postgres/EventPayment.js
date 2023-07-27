module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Event extends Model {
    }

    Event.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            aggregate_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            aggregate_type: {
                type: DataTypes.ENUM,
                values: ['Transaction', 'Operation'],
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payload: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        { sequelize: connection, tableName: "events" }
    );

    return Event;
};
