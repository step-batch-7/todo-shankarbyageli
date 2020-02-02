const showTodoForm = function () {
  newItemForm.style.display = 'block';
};

const hideTodoForm = function () {
  newItemForm.style.display = 'none';
};

const getTodoHTML = function (id, details) {
  const todo = document.createElement('li');
  todo.id = id;
  todo.className = 'todo';
  const title = document.createElement('span');
  title.innerText = details.title;
  title.id = 'todoTitle';
  todo.appendChild(title);
  return todo;
};

const renderNewTodo = function () {
  const [id, details] = JSON.parse(this.responseText);
  const todo = getTodoHTML(id, details);
  document.querySelector('#todoList').prepend(todo);
};

const renderTodos = function () {
  const response = JSON.parse(this.responseText);
  console.log(response);
  for (let item in response) {
    const todo = getTodoHTML(item, response[item]);
    document.querySelector('#todoList').append(todo);
  }
};

const main = function () {
  const noTodo = `<div id='no-todo'>
    You Don't have any TODO !! <br>
    <button class='addNew' style='width: 40%; height: 8vh'> Add TODO </button>
  </div>`;
  const a = new Date();
  const date = document.querySelector('#date');
  date.innerText = 'Date: ' + a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
  const xhr = new XMLHttpRequest();
  xhr.onload = renderTodos;
  xhr.open('GET', '/list');
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
