import tarefaService from '../services/tarefaService';

const getTarefas = async (req, res) => {
  const tarefas = await tarefaService.listarTarefas(req.context.models);
  return res.send(tarefas);
};

const getTarefaById = async (req, res) => {
  const tarefa = await tarefaService.buscarPorId(req.context.models, req.params.objectId);
  if (tarefa) {
    return res.send(tarefa);
  }
  return res.status(404).send({ error: "Tarefa não encontrada" });
};

const createTarefa = async (req, res) => {
  try {
    const nova = await tarefaService.criarTarefa(req.context.models, req.body);
    return res.status(201).send(nova);
  } catch (error) {
    return res.status(400).send({ error: "Descrição é obrigatória" });
  }
};

const updateTarefa = async (req, res) => {
  const atualizada = await tarefaService.atualizarTarefa(req.context.models, req.params.objectId, req.body);
  if (atualizada) {
    return res.send(atualizada);
  }
  return res.status(404).send({ error: "Tarefa não encontrada" });
};

const deleteTarefa = async (req, res) => {
  const deletado = await tarefaService.deletarTarefa(req.context.models, req.params.objectId);
  if (deletado) {
    return res.status(204).send();
  }
  return res.status(404).send({ error: "Tarefa não encontrada" });
};

export default {
  getTarefas,
  getTarefaById,
  createTarefa,
  updateTarefa,
  deleteTarefa
};