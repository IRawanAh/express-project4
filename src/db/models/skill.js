'use strict';
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: DataTypes.STRING
  }, { tableName: 'skills' });
  Skill.associate = function (models) {
    // Skill.belongsToMany(models.User, {
    //   through: 'userskills',
    //   as: 'users',
    //   foreignKey: 'skill_id'
    // });

    Skill.hasMany(models.userskills)
    // associations can be defined here

  };
  return Skill;
};