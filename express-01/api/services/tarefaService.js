const listarTarefas = async (models) => {
  return await models.Tarefa.findAll();
};

const buscarPorId = async (models, id) => {
  return await models.Tarefa.findByPk(id);
};

const criarTarefa = async (models, dados) => {
  return await models.Tarefa.create(dados);
};

const atualizarTarefa = async (models, id, dados) => {
  const tarefa = await models.Tarefa.findByPk(id);
  if (!tarefa) return null;
  return await tarefa.update(dados);
};

const deletarTarefa = async (models, id) => {
  const tarefa = await models.Tarefa.findByPk(id);
  if (!tarefa) return null;
  await tarefa.destroy();
  return true;
};

export default {
  listarTarefas,
  buscarPorId,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa
};