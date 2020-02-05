const xmlRequest = function (request, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(request.method, request.url);
  xhr.send(JSON.stringify(request.body));
  xhr.onload = callback;
  xhr.onerror = function () {
    const html = '<h1 id="lost"> Something went wrong ! <br> Sorry for inconvenience </h1>'
    document.body.innerHTML = html;
  }
};

const createRequest = function (method, url, body) {
  return { method, url, body };
};

const deleteTodo = function () {
  const id = event.target.parentElement.id.split('-').pop();
  const request = createRequest('DELETE', '/todo', { id });
  xmlRequest(request, function () {
    select(`#todo-${id}`).remove();
    renderEmptyList();
    todoList.deleteTodo(id);
  });
};

const deleteTask = function () {
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const request = createRequest('DELETE', '/task', { todoId, taskId });
  xmlRequest(request, function () {
    select(`#item-${todoId}-${taskId}`).remove();
    renderEmptyList();
    todoList.deleteTask(todoId, taskId);
  });
};

const extractTitle = function () {
  const title = select('#input').value;
  select('#input').value = '';
  if (title.trim() === '') {
    return false;
  }
  return title;
}

const addNewTodo = function () {
  const title = extractTitle();
  if (!title) {
    return;
  }
  event.preventDefault();
  const request = createRequest('PUT', '/newTodo', { title })
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
  const request = createRequest('PUT', '/newItem', { id: todoId, title });
  xmlRequest(request, function () {
    renderNewItem(this.responseText, todoId);
  });
};

const changeTaskStatus = function () {
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const request = createRequest('PUT', '/taskStatus', { todoId, taskId });
  xmlRequest(request, function () {
    todoList.changeStatus(todoId, taskId);
  });
};

const getAllTodos = function () {
  const request = createRequest('GET', '/list', {});
  xmlRequest(request, function () {
    const serverList = JSON.parse(this.responseText);
    todoList.addList(serverList);
    renderTodos();
  });
};
