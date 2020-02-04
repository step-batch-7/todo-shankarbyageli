const todoList = new TodoList();

const createDivElement = function (innerText, id, className) {
  const div = document.createElement('div');
  div.innerText = innerText;
  div.id = id;
  div.className = className;
  return div;
};

const main = function () {
  const a = new Date();
  const date = document.querySelector('#date');
  date.innerText = 'Date: ' + a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
  getAllTodos();
};
