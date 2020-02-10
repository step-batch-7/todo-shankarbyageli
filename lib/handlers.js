const fs = require('fs');
const App = require('../app');
const TodoList = require('./TodoList');
const { STATUS_CODES, CONTENT_TYPES } = require('./utilities');

const DATABASE = process.env.DATABASE;
const todoData = JSON.parse(fs.readFileSync(DATABASE, 'utf8') || '[]');
const STATIC_FOLDER = './public';
const todo = new TodoList(todoData);

const serveStaticFile = function (req, res, next) {
  let path = req.url;
  if (path === '/') {
    path = '/signUp.html';
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

const sendResponse = function (res, body) {
  res.writeHead(STATUS_CODES.success, {
    'Content-Type': 'application/json'
  });
  fs.writeFileSync(DATABASE, JSON.stringify(todo.list));
  res.end(JSON.stringify(body));
};

const addNewItem = function (req, res) {
  const { id, title } = JSON.parse(req.body);
  todo.addItem(id, title);
  sendResponse(res, todo.getTodo(id));
};

const addNewTodo = function (req, res) {
  const { title } = JSON.parse(req.body);
  todo.addTodo(title);
  sendResponse(res, todo.list);
};

const deleteTodo = function (req, res) {
  const { id } = JSON.parse(req.body);
  todo.deleteTodo(id);
  sendResponse(res, todo.list);
};

const deleteTask = function (req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  todo.deleteTask(todoId, taskId);
  const todoData = todo.getTodo(todoId);
  sendResponse(res, todoData);
};

const serveTodo = function (req, res) {
  const { todoId } = req.query;
  const todoDetails = todo.getTodo(todoId);
  sendResponse(res, todoDetails);
};

const changeStatus = function (req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  todo.changeStatus(todoId, taskId);
  const todoData = todo.getTodo(todoId);
  sendResponse(res, todoData);
};

const editTodo = function (req, res) {
  const { todoId, title } = JSON.parse(req.body);
  todo.editTodo(todoId, title);
  sendResponse(res, todo.list);
};

const editTask = function (req, res) {
  const { todoId, taskId, title } = JSON.parse(req.body);
  todo.editTask(todoId, taskId, title);
  const todoData = todo.getTodo(todoId);
  sendResponse(res, todoData);
};

const serveTodoList = function (req, res) {
  const { cookie } = req.headers;
  const todoList = getTodoList(cookie);
  sendResponse(res, todoList.list);
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

const userExist = function (userCredentials, userData) {
  const userNames = userCredentials.map(user => user.username);
  const email = userCredentials.map(user => user.email);
  if (userNames.includes(userData.username)) {
    return { userNameError: 'username already exist' };
  }
  if (email.includes(userData.email)) {
    return { emailError: 'email is already registered' };
  }
};

const signUp = function (req, res, next) {
  const userCredentials =
    JSON.parse(fs.readFileSync('./database/userCredentials.json', 'utf8'));
  const userData = JSON.parse(req.body);
  const error = userExist(userCredentials, userData);
  if (error) {
    res.writeHead(200);
    res.end(JSON.stringify(error));
    return;
  }
  userData.date = new Date().toLocaleString();
  userCredentials.push(userData);
  fs.writeFileSync('./database/userCredentials.json', JSON.stringify(userCredentials));
  fs.writeFileSync(`./database/users/${userData.username}.json`, '[]');
  res.writeHead(200);
  res.end('{}');
};

const app = new App();

app.use(parseBody);
app.get('/list', serveTodoList);
app.get('/todo', serveTodo);
app.post('/signup', signUp);
app.post('/newTodo', addNewTodo);
app.post('/newItem', addNewItem);
app.delete('/todo', deleteTodo);
app.delete('/task', deleteTask);
app.put('/taskStatus', changeStatus);
app.put('/editTodo', editTodo);
app.put('/editTask', editTask);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = app;
