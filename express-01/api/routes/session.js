import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// 1. LOGIN (Gera o Token JWT e o Refresh Token)
router.post("/", async (req, res) => {
  const { login, password } = req.body;

  const user = await req.context.models.User.findByLogin(login);
  
  if (!user) {
    return res.status(401).send({ error: "Usuário ou senha inválidos." });
  }

  // Verifica a senha (em um app real usaríamos bcrypt.compare, mas para o seu seeder simples, validamos assim)
  if (user.password !== password) {
     return res.status(401).send({ error: "Usuário ou senha inválidos." });
  }

  // Gera o JWT (Access Token)
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m" }
  );

  // Gera o Refresh Token
  const refreshToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

  // Salva no banco
  await req.context.models.RefreshToken.create({
    token: refreshToken,
    expiresAt: expiresAt,
    userId: user.id
  });

  return res.send({ accessToken, refreshToken });
});

// 2. REFRESH (Gera novos tokens mantendo a validade original do refresh)
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send({ error: "Refresh token não fornecido." });
  }

  // Busca o token no banco
  const tokenRecord = await req.context.models.RefreshToken.findOne({
    where: { token: refreshToken }
  });

  if (!tokenRecord) {
    return res.status(403).send({ error: "Refresh token inválido." });
  }

  // Verifica se expirou
  if (tokenRecord.expiresAt < new Date()) {
    await tokenRecord.destroy();
    return res.status(403).send({ error: "Refresh token expirado. Faça login novamente." });
  }

  const user = await req.context.models.User.findByPk(tokenRecord.userId);

  // Gera novo JWT
  const newAccessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m" }
  );

  // Gera novo Refresh Token
  const newRefreshToken = uuidv4();

  // Salva o novo e apaga o antigo, mantendo a data de expiração do original
  await req.context.models.RefreshToken.create({
    token: newRefreshToken,
    expiresAt: tokenRecord.expiresAt, 
    userId: user.id
  });

  await tokenRecord.destroy();

  return res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// 3. LOGOUT (Invalida o Refresh Token)
router.delete("/logout", async (req, res) => {
   const { refreshToken } = req.body;
   
   if (refreshToken) {
       await req.context.models.RefreshToken.destroy({
           where: { token: refreshToken }
       });
   }
   
   return res.send({ message: "Logout realizado com sucesso." });
});

// 4. GET SESSION (Retorna os dados do usuário logado - protegido pelo middleware)
router.get("/", async (req, res) => {
  return res.send(req.context.me);
});

export default router;