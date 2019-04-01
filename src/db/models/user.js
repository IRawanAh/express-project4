"use strict";
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: DataTypes.STRING,
        field: "hashed_password",
        allowNull: false

      },
      name: {
        type: DataTypes.STRING,
      },
      linkedin: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      twitter: {
        type: DataTypes.STRING,
      },
      github: {
        type: DataTypes.STRING,
      },


    },
    {
      tableName: "users",
      hooks: {
        beforeCreate: user => {
          const hashCost = 10;
          user.hashedPassword = bcrypt.hashSync(user.hashedPassword, hashCost);
        }
      }
    }
  );

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  };

  User.prototype.bcrypt = function (password) {
    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10;
    this.hashedPassword = bcrypt.hashSync(password, hashCost);
    this.save();
  };

  User.associate = models => {
    User.belongsToMany(models.Skill, {
      through: 'userskills',
      as: 'skills',
      foreignKey: 'user_id'
    });
    // associations can be defined here

  };
  return User;
};
