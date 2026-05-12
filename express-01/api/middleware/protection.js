const protectRoutes = (req, res, next) => {
  // Rotas que são exceções (públicas)
  const publicRoutes = [
    { method: 'POST', path: '/session' },
    { method: 'POST', path: '/session/refresh' },
    { method: 'POST', path: '/users' },
  ];

  const isPublic = publicRoutes.find(
    (route) => route.method === req.method && req.path === route.path
  );

  // Leitura e Perfil: Todas as rotas GET permanecem públicas, EXCETO GET /session
  if (req.method === 'GET' && req.path !== '/session') {
    return next();
  }

  // Se a requisição for para uma rota pública da whitelist, permite
  if (isPublic) {
    return next();
  }

  // Bloqueio de Escrita e rotas protegidas: exige usuário autenticado
  if (!req.context.me) {
    return res.status(401).send({ error: 'Unauthorized: Faça login para acessar esta rota.' });
  }

  next();
};

export default protectRoutes;