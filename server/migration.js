const db = require("./db/models/postgres");
const mongoose = require("mongoose");

const mode = process.argv[2] ?? "alter";

db.connection
    .sync({ [mode]: true })
    .then(() =>
        console.log("\u001b[" + 32 + "m" + "schema has been updated" + "\u001b[0m")
    )
    .then(() => {
        db.connection.close();
        mongoose.connection.close();
    })
    .catch((err) => console.log("\u001b[1;" + 31 + "m" + err + "\u001b[0m"));
