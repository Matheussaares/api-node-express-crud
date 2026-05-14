const getUserModel = (sequelize, { DataTypes }) => {
  // Define a estrutura da tabela "User" no banco de dados
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true, // Não permite nomes de usuário repetidos
      allowNull: false,
      validate: {
        notEmpty: true, // Impede que o campo seja preenchido com string vazia
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true, // Não permite emails repetidos
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Torna o campo de senha obrigatório para a autenticação
      validate: {
        notEmpty: true,
      },
    },
  });

  // Configura os relacionamentos (Foreign Keys) com outras tabelas
  User.associate = (models) => {
    // Um usuário tem várias mensagens; se deletar o usuário, apaga as mensagens dele (CASCADE)
    User.hasMany(models.Message, { onDelete: "CASCADE" });
  };

  // Método personalizado para encontrar o usuário tanto pelo username quanto pelo email
  User.findByLogin = async (login) => {
    let user = await User.findOne({
      where: { username: login },
    });

    // Se não achar pelo username, tenta achar pelo email
    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  return User;
};

export default getUserModel;