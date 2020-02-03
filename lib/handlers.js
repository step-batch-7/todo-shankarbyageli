const fs = require('fs');
const App = require('../app');
const todoData = require('../database/todoList.json');
const TodoList = require('./TodoList');
const { STATUS_CODES, CONTENT_TYPES } = require('./utilities');

const STATIC_FOLDER = './public';
const DATABASE = './database/todoList.json';
const todo = new TodoList(todoData);

const serveStaticFile = function (req, res, next) {
  let path = req.url;
  if (path === '/') {
    path = '/index.html';
  }
  const filePath = `${STATIC_FOLDER}${path}`;
  const stat = fs.existsSync(filePath) && fs.statSync(filePath);
  if (!stat || !stat.isFile()) {
    next();
    return;
  }
  const [, extension] = filePath.match(/.*\.(.*)$/);
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(filePath);
  res.writeHead(STATUS_CODES.success, { 'Content-Type': contentType });
  res.end(content);
};

const addNewTodo = function (req, res) {
  const id = todo.addNewTodo(req.body);
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'text/plain'
  });
  const response = JSON.stringify([id, todo.getTodo(id)]);
  fs.writeFileSync(DATABASE, todo.toString());
  res.end(response);
};

const serveTodos = function (req, res) {
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'text/plain'
  });
  res.end(JSON.stringify(todo.todos));
};

const parseBody = function (req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const notFound = function (req, res) {
  res.writeHead(STATUS_CODES.notFound);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(STATUS_CODES.notAllowed);
  res.end('Method Not Allowed');
};

const app = new App();

app.use(parseBody);
app.get('/list', serveTodos);
app.post('/newTodo', addNewTodo);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = app;
