const createDivElement = function (innerText, id, className) {
  const spanElement = document.createElement('div');
  spanElement.innerText = innerText;
  spanElement.id = id;
  spanElement.className = className;
  return spanElement;
};

const getTodoHTML = function (id, details) {
  const todo = document.createElement('li');
  todo.id = id;
  todo.className = 'todo';
  const title = createDivElement(details.title, 'todoTitle', 'todoTitleText');
  todo.appendChild(title);
  const addItem = createDivElement('Add Item', `addItem-${id}`, 'addItem');
  todo.appendChild(addItem);
  const remove = createDivElement('Delete', `delete-${id}`, 'delete');
  todo.appendChild(remove);
  return todo;
};

const main = function () {
  const a = new Date();
  const date = document.querySelector('#date');
  date.innerText = 'Date: ' + a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
  getAllTodos();
};
