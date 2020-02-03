const renderNewTodo = function () {
  const details = JSON.parse(this.responseText);
  const todo = getTodoHTML(details);
  document.querySelector('#todoList').prepend(todo);
};

const renderTodos = function (todoList) {
  for (let item of todoList) {
    const todo = getTodoHTML(item);
    document.querySelector('#todoList').prepend(todo);
  }
};
