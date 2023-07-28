module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");
    const mongo = require("../mongo");

    class Event extends Model { }

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

    Event.addHook("afterCreate", async (event) => {
        // console.log(event)
        let update = {}
        let filters = {}
        switch (event.type) {
            case 'TransactionCreated':
                update.amount = event.payload.amount
                update.currency = event.payload.currency
                update.client_info = event.payload.client_info
                filters.transaction_id = event.aggregate_id
                break;
            case 'TransactionUpdated':
                update.status = event.payload.status
                filters.transaction_id = event.aggregate_id
                break;
            case 'OperationCreated':
                update = {
                    $push: {
                        operations: { "status": event.payload.status || null, "amount": event.payload.amount || null, "type": event.payload.type || null }
                    }
                };
                // update.operations = { $each: [{ "status": event.payload.status, "amount": event.payload.amount, "type": event.payload.type }] }
                filters.transaction_reference = event.payload.transaction_reference
                break;
            case 'OperationUpdated':
                update = {
                    $push: {
                        operations: { "status": event.payload.status || null, "amount": event.payload.amount || null, "type": event.payload.type || null }
                    }
                };
                // update.operations = { $each: [{ "status": event.payload.status, "amount": event.payload.amount, "type": event.payload.type }] }
                filters.transaction_id = event.aggregate_id
                break;
        }


        mongo.Transaction.findOneAndUpdate(filters, update).catch((error) => {

            console.log(error)
        })
    })

    async function addOperationsIncrement(parentId, nouveauxEnfants) {
        try {
            let parent = await mongo.Transaction.findById(parentId);

            for (const nouvelEnfant of nouveauxEnfants) {
                parent.enfants.push(nouvelEnfant);
                await parent.save();
            }

            console.log('Enfants ajoutés avec succès !');
        } catch (err) {
            console.error(err);
        }
    }

    // ajouterEnfantsIncrementalement(parentId, nouveauxEnfants);
    return Event;
};
