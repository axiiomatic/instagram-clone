'use strict';
module.exports = (sequelize, DataTypes) => {
  const slug = sequelize.define('slug', {
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
  slug.associate = function (models) {
    // associations can be defined here
  };
  return slug;
};
