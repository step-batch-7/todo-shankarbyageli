const getTodoItems = function () {
  const id = event.target.id.split('-').pop();
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    renderTodoItems(id, this.responseText);
  };
  xhr.open('GET', `/todoItems?id=${event.target.parentElement.id.split('-').pop()}`);
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
  xhr.onload = function () {
    document.querySelector(`#todo-${this.responseText}`).remove();
  };
  xhr.open('POST', '/deleteTodo');
  xhr.send(event.target.parentElement.id.split('-').pop());
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
