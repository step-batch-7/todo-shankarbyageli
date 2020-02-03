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
