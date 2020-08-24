const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

function validadeRepositoryId(request,response, next) {
  const {id} = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid repository ID'});
  }
  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validadeRepositoryId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url, techs} = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  if(repositoryIndex < 0) {
    return response.status(400).json({message: "Repository not found"});
  }
  const repository = {
    id,
    title: title ? title: repositories[repositoryIndex].title, 
    url: url ? url: repositories[repositoryIndex].url,
    techs: techs ? techs: repositories[repositoryIndex].techs,
    likes : repositories[repositoryIndex].likes
  }
  repositories[repositoryIndex] = repository;
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  if(repositoryIndex < 0) {
    return response.status(400).json({message: "Repository not found"});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  if(repositoryIndex < 0) {
    return response.status(400).json({message: "Repository not found"});
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;
  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
