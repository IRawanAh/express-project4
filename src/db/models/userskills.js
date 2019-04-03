'use strict';
module.exports = (sequelize, DataTypes) => {
  const userskills = sequelize.define('userskills', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'skills',
        key: 'id'
      }
    },
    level: DataTypes.INTEGER
  }, {});
  userskills.associate = function (models) {
    userskills.belongsTo(models.User, {

      foreignKey: {
        field: "user_id"
      }
    })
    userskills.belongsTo(models.Skill, {
      foreignKey: {
        field: "skill_id"
      }
    })

    // associations can be defined here
  };
  return userskills;
};