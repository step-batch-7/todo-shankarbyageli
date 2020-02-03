const deleteTodo = function () {
  const xhr = new XMLHttpRequest();
  const id = event.target.parentElement.id.split('-').pop();
  xhr.onload = function () {
    document.querySelector(`#todo-${id}`).remove();
  };
  xhr.open('DELETE', '/todo');
  xhr.send(id);
};

const addNewTodo = function () {
  event.preventDefault();
  const title = document.querySelector('#input').value;
  const xhr = new XMLHttpRequest();
  xhr.onload = renderNewTodo;
  xhr.open('PUT', '/newTodo');
  xhr.send(title);
};

const getAllTodos = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const todoList = JSON.parse(this.responseText);
    renderTodos(todoList);
  }
  xhr.open('GET', '/list');
  xhr.send();
};
