const todoList = new TodoList();
const select = document.querySelector.bind(document);

const main = function () {
  const a = new Date();
  const date = document.querySelector('#date');
  date.innerText = 'Date: ' + a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear();
  getAllTodos();
};
