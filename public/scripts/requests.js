const getTodoItems = function () {
  const id = event.target.id.split('-').pop();
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    renderTodoItems(id, JSON.parse(this.responseText));
  }
  xhr.open('GET', `/todoItems?id=${id}`);
  xhr.send();
};

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

const getItemId = function (element) {
  const id = element.parentElement.previousElementSibling.children[0].id;
  return id.split('-').pop();
};

const addNewItem = function () {
  event.preventDefault();
  const todoId = getItemId(event.target);
  const title = document.querySelector('#input').value;
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    renderNewItem(this.responseText, todoId);
  }
  xhr.open('PUT', `/newItem?id=${todoId}`);
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
