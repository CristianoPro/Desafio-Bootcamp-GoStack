const express = require("express"); //micro framework
const app = express();

app.use(express.json());

let numberOfRequest = 0;
const projects = [];

//Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//Middleware que dá log no número de requisições
function logRequests(req, res, next) {
  numberOfRequest++;

  console.log(`Número de requisições: ${numberOfRequest}`);

  return next();
}

app.use(logRequests);

//rota para adicionar um novo projeto
app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//rota para listar todos os projetos
app.get("/projects", (req, res) => {
  return res.json(projects);
});

//rota para alterar apenas o titulo do projeto
app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//rota para deletar um projedo da lista
app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//rota para adicionar uma nova tarefa ao projeto
app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
});

app.listen(3000);
