#!/bin/bash

mongosh --username root --password password <<EOF
   var cfg = {
        "_id": "rs",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "mongodb:27017",
                "priority": 2
            },
            {
                "_id": 1,
                "host": "mongodb-replica:27017",
                "priority": 0
            },
        ]
    };
    rs.initiate(cfg, { force: true });
    rs.status();
EOF
sleep 10

mongosh --username root --password password <<EOF
   use admin;
   admin = db.getSiblingDB("admin");
   admin.createUser(
     {
	user: "admin",
        pwd: "password",
        roles: [ { role: "root", db: "admin" } ]
     });
     db.getSiblingDB("admin").auth("admin", "password");
     rs.status();
EOF