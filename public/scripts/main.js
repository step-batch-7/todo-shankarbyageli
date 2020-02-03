const createDivElement = function (innerText, id, className) {
  const div = document.createElement('div');
  div.innerText = innerText;
  div.id = id;
  div.className = className;
  return div;
};

const getTodoHTML = function (details) {
  const todo = document.createElement('li');
  todo.id = `todo-${details.id}`;
  todo.className = 'todo';
  const title = createDivElement(details.title, 'todoTitle', 'todoTitleText');
  // title.onclick = getTodoItems;
  todo.appendChild(title);
  const view = createDivElement('View', `view-${details.id}`, 'view');
  // view.onclick = getTodoItems;
  todo.appendChild(view);
  const remove = createDivElement('Delete', `delete-${details.id}`, 'delete');
  remove.onclick = deleteTodo;
  todo.appendChild(remove);
  return todo;
};

const main = function () {
  const a = new Date();
  const date = document.querySelector('#date');
  date.innerText = 'Date: ' + a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
  getAllTodos();
};