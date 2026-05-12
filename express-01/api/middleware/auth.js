import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Se não mandou token, apenas segue. O próximo middleware (protectRoutes) decide se bloqueia.
  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');

  // Verifica se o formato é "Bearer <TOKEN>"
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).send({ error: 'Token malformado' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário pelo ID salvo no token (verifique se seu model usa findByPk ou findById)
    const user = await req.context.models.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({ error: 'Usuário não encontrado' });
    }

    // Adiciona o usuário logado ao contexto
    req.context.me = user;
    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;