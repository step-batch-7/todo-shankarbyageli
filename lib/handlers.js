const fs = require('fs');
const App = require('../app');
const TodoList = require('./TodoList');
const { STATUS_CODES, CONTENT_TYPES } = require('./utilities');

const DATABASE = process.env.DATABASE;
let todoData = fs.readFileSync(DATABASE, 'utf8');
if (!todoData) {
  todoData = '[]';
}
todoData = JSON.parse(todoData);
const STATIC_FOLDER = './public';
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

const addNewItem = function (req, res) {
  const { id, title } = JSON.parse(req.body);
  const newItem = todo.addItem(id, title);
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'application/json'
  });
  const content = todo.toString();
  fs.writeFileSync(DATABASE, content);
  res.end(JSON.stringify(newItem));
};

const addNewTodo = function (req, res) {
  const { title } = JSON.parse(req.body);
  const newTodo = todo.addTodo(title);
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'application/json'
  });
  const content = todo.toString();
  fs.writeFileSync(DATABASE, content);
  res.end(JSON.stringify(newTodo));
};

const deleteTodo = function (req, res) {
  const { id } = JSON.parse(req.body);
  todo.deleteTodo(id);
  res.writeHead(STATUS_CODES.success);
  fs.writeFileSync(DATABASE, todo.toString());
  res.end();
};

const deleteTask = function (req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  todo.deleteTask(todoId, taskId);
  res.writeHead(STATUS_CODES.success);
  fs.writeFileSync(DATABASE, todo.toString());
  res.end();
};

const changeStatus = function (req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  todo.changeStatus(todoId, taskId);
  res.writeHead(STATUS_CODES.success);
  fs.writeFileSync(DATABASE, todo.toString());
  res.end();
};

const editTodo = function (req, res) {
  const { todoId, title } = JSON.parse(req.body);
  todo.editTodo(todoId, title);
  res.writeHead(STATUS_CODES.success);
  fs.writeFileSync(DATABASE, todo.toString());
  res.end();
};

const serveTodos = function (req, res) {
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'application/json'
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
app.post('/newTodo', addNewTodo);
app.post('/newItem', addNewItem);
app.delete('/todo', deleteTodo);
app.delete('/task', deleteTask);
app.put('/taskStatus', changeStatus);
app.put('/editTodo', editTodo);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = app;
