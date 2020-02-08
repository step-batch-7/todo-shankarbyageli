const xmlRequest = function (request, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(request.method, request.url);
  xhr.send(JSON.stringify(request.body));
  xhr.onload = callback;
  xhr.onerror = function () {
    const html = '<h1 id="lost"> Something went wrong ! <br> Sorry for inconvenience </h1>';
    document.body.innerHTML = html;
  };
};

const createRequest = function (method, url, body) {
  return { method, url, body };
};

const getTasks = function () {
  const todoId = event.target.parentElement.id.split('-').pop();
  const request = createRequest('GET', `/todo?todoId=${todoId}`, {});
  xmlRequest(request, function () {
    const todo = JSON.parse(this.responseText);
    renderTodoTasks(todo);
  });
};

const editTodo = function (todoId, title) {
  const request = createRequest('PUT', '/editTodo', { todoId, title });
  xmlRequest(request, function () {
    const todoList = JSON.parse(this.responseText);
    renderTodos(todoList);
  });
};

const editTask = function (todoId, taskId, title) {
  const request = createRequest('PUT', '/editTask', { todoId, taskId, title });
  xmlRequest(request, function () {
    const todo = JSON.parse(this.responseText);
    renderTodoTasks(todo);
  });
};

const deleteTodo = function () {
  const id = event.target.parentElement.id.split('-').pop();
  const request = createRequest('DELETE', '/todo', { id });
  xmlRequest(request, function () {
    select(`#todo-${id}`).remove();
    renderEmptyList();
    const todoList = JSON.parse(this.responseText);
    renderTodos(todoList);
  });
};

const deleteTask = function () {
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const request = createRequest('DELETE', '/task', { todoId, taskId });
  xmlRequest(request, function () {
    select(`#item-${todoId}-${taskId}`).remove();
    renderEmptyList();
    const todo = JSON.parse(this.responseText);
    renderTodoTasks(todo);
  });
};

const extractTitle = function () {
  const title = select('#input').value;
  select('#input').value = '';
  if (title.trim() === '') {
    return false;
  }
  return title;
};

const addNewTodo = function () {
  const title = extractTitle();
  if (!title) {
    return;
  }
  event.preventDefault();
  const request = createRequest('POST', '/newTodo', { title });
  xmlRequest(request, renderNewTodo);
};

const getItemId = function (element) {
  const id = element.parentElement.previousElementSibling.children[0].id;
  return id.split('-').pop();
};

const addNewItem = function () {
  const title = extractTitle();
  if (!title) {
    return;
  }
  event.preventDefault();
  const todoId = getItemId(event.target);
  const request = createRequest('POST', '/newItem', { id: todoId, title });
  xmlRequest(request, function () {
    const todo = JSON.parse(this.responseText);
    renderTodoTasks(todo);
  });
};

const changeTaskStatus = function () {
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const request = createRequest('PUT', '/taskStatus', { todoId, taskId });
  xmlRequest(request, function () {
    const todo = JSON.parse(this.responseText);
    renderTodoTasks(todo);
  });
};

const getAllTodos = function () {
  const request = createRequest('GET', '/list', {});
  xmlRequest(request, function () {
    const todoList = JSON.parse(this.responseText);
    renderTodos(todoList);
  });
};
