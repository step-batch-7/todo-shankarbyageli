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
  const newTodo = todo.addTodo(req.body);
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'text/plain'
  });
  const content = todo.toString();
  fs.writeFileSync(DATABASE, content);
  res.end(JSON.stringify(newTodo));
};

const deleteTodo = function (req, res) {
  todo.deleteTodo(req.body);
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'text/plain'
  });
  fs.writeFileSync(DATABASE, todo.toString());
  res.end();
};

const serveTodos = function (req, res) {
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'text/plain'
  });
  res.end(todo.toString());
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
app.put('/newTodo', addNewTodo);
app.delete('/todo', deleteTodo);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = app;
