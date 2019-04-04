'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    skill_id: DataTypes.INTEGER,
    contact: DataTypes.STRING
  }, { tableName: 'posts' });
  Post.associate = function (models) {
    // associations can be defined here
  };
  return Post;
};