module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define('like', {});
  like.associate = function (models) {
    // associations can be defined here

    like.belongsTo(models.post);
    like.belongsTo(models.user);
  };
  return like;
};
