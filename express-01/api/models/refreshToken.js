const getRefreshTokenModel = (sequelize, { DataTypes }) => {
  const RefreshToken = sequelize.define('refreshToken', {
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User);
  };

  return RefreshToken;
};

export default getRefreshTokenModel;