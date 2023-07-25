module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const bcrypt = require("bcryptjs");

  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Cart, { foreignKey: "customer_id", as: "carts" });
    }

    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le prénom est obligatoire",
          },
        },
      },
      lastname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le nom est obligatoire",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "L'email est obligatoire",
          },
          isEmail: {
            msg: "L'email doit être valide",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 32],
          is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
          notNull: {
            msg: "Le mot de passe est obligatoire",
          },
        },
      },
    },
    { sequelize: connection, tableName: "customers" }
  );

  function updatePassword(customer) {
    return bcrypt.genSalt(10).then((salt) =>
      bcrypt.hash(customer.password, salt).then((hash) => {
        customer.password = hash;
      })
    );
  }

  Customer.addHook("beforeCreate", async (customer) => {
    return updatePassword(customer);
  });

  return Customer;
};
