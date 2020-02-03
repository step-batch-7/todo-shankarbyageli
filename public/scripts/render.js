const renderNewTodo = function () {
  const [id, details] = JSON.parse(this.responseText);
  const todo = getTodoHTML(id, details);
  document.querySelector('#todoList').prepend(todo);
};

const renderTodos = function () {
  const response = JSON.parse(this.responseText);
  for (let item in response) {
    const todo = getTodoHTML(item, response[item]);
    document.querySelector('#todoList').prepend(todo);
  }
};
