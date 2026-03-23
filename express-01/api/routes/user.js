import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

router.post("/", async (req, res) => {
  // Cria um novo usuário com os dados que vierem no corpo da requisição
  const user = await req.context.models.User.create(req.body);
  return res.send(user);
});

router.put("/:userId", async (req, res) => {
  // Busca o usuário pelo ID
  const user = await req.context.models.User.findByPk(req.params.userId);
  if (user) {
    // Se achar, atualiza com os dados novos
    await user.update(req.body);
    return res.send(user);
  } else {
    return res.status(404).send({ error: "Usuário não encontrado" });
  }
});

router.delete("/:userId", async (req, res) => {
  // Deleta o usuário baseado no ID passado na URL
  const result = await req.context.models.User.destroy({
    where: { id: req.params.userId },
  });
  return res.send(result === 1); // Retorna true se deletou com sucesso
});

export default router;