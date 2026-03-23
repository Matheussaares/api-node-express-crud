import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await req.context.models.Message.findAll();
  return res.send(messages);
});

router.get("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findByPk(req.params.messageId);
  return res.send(message);
});

router.post("/", async (req, res) => {
  const message = await req.context.models.Message.create(req.body);
  return res.send(message);
});

router.put("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findByPk(req.params.messageId);
  if (message) {
    await message.update(req.body);
    return res.send(message);
  } else {
    return res.status(404).send({ error: "Mensagem não encontrada" });
  }
});

router.delete("/:messageId", async (req, res) => {
  const result = await req.context.models.Message.destroy({
    where: { id: req.params.messageId },
  });
  return res.send(result === 1);
});

export default router;