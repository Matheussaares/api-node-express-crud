import { DataTypes } from 'sequelize';

const getTarefa = (sequelize) => {
  const Tarefa = sequelize.define('Tarefa', {
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'tarefas',
    timestamps: true
  });

  return Tarefa;
};

export default getTarefa;