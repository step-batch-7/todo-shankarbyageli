const getTodoItems = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = renderTodos;
  xhr.open('GET', `/getItems?id=${event.target.parentElement.id}`);
  xhr.send();
};

const addTodoItem = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = renderTodos;
  xhr.open('GET', `/addItem?id=${event.target.parentElement.id}`);
  xhr.send();
};

const deleteTodo = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = renderTodos;
  xhr.open('GET', `/deleteTodo?id=${event.target.parentElement.id}`);
  xhr.send();
};

const addNewTodo = function () {
  event.preventDefault();
  const title = document.querySelector('#input').value;
  const xhr = new XMLHttpRequest();
  xhr.onload = renderNewTodo;
  xhr.open('POST', '/newTodo');
  xhr.send(title);
};

const getAllTodos = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = renderTodos;
  xhr.open('GET', '/list');
  xhr.send();
};
