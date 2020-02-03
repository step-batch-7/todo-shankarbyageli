const renderNewTodo = function () {
  const [id, details] = JSON.parse(this.responseText);
  const todo = getTodoHTML(id, details);
  document.querySelector('#todoList').prepend(todo);
};

const renderEmptyList = function () {
  const noTodo = `<div id='no-todo'>
    You Don't have any TODO !! <br>
    <button class='addNew' style='width: 40%; height: 8vh'> Add TODO </button>
  </div>`;
  return noTodo;
};

const renderTodos = function () {
  const response = JSON.parse(this.responseText);
  for (let item in response) {
    const todo = getTodoHTML(item, response[item]);
    document.querySelector('#todoList').prepend(todo);
  }
};
