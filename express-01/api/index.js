import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models";
import routes from "./routes";

// Importando a nova rota de tarefas organizada
import tarefaRoutes from "./routes/tarefa"; 

// Importando os middlewares de segurança
import authMiddleware from "./middleware/auth";
import protectRoutes from "./middleware/protection";

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando o contexto da requisição com os modelos do banco de dados
app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Middlewares de segurança (devem ser aplicados após o contexto e antes das rotas)
app.use(authMiddleware);
app.use(protectRoutes);

// Logger para registrar todas as requisições no console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

// Adicionando o endpoint no plural como exigido na nova atividade
app.use("/tarefas", tarefaRoutes); 

app.get("/", (req, res) => {
  res.send(
    "Received a GET HTTP method\nServidor rodando!\n" + process.env.MESSAGE,
  );
});

// Mantemos essa rota para não quebrar o App Mobile da atividade anterior
app.use("/tarefa", routes.message);

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(port, () =>
    console.log(
      "Express-01 app listening on port " + port + "!\n" + process.env.MESSAGE,
    ),
  );
});

// Função para semear o banco de dados inicial com os usuários de teste
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      password: "password123", // Senha necessária para testar o login posteriormente
      messages: [
        {
          text: "Published the Road to learn React",
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      password: "password123", // Senha necessária para testar o login posteriormente
      messages: [
        {
          text: "Happy to release ...",
        },
        {
          text: "Published a complete ...",
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};

export default app;