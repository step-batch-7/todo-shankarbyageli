const renderNewTodo = function () {
  const details = JSON.parse(this.responseText);
  const todo = getTodoHTML(details);
  document.querySelector('.todoList').prepend(todo);
};

const renderNewItem = function (responseText, todoId) {
  const details = JSON.parse(responseText);
  const item = getItemHTML(todoId, details);
  document.querySelector('.todoList').appendChild(item);
};

const removeAllChildren = function (id) {
  let element = document.querySelector(`.${id}`);
  while (element.children.length) {
    element.children[0].remove();
  }
};

const getItemHTML = function (todoId, item) {
  const newItem = document.createElement('li');
  newItem.id = `item-${todoId}-${item.id}`;
  newItem.className = 'item';
  const status = document.createElement('input');
  status.type = 'checkBox';
  status.className = 'status';
  newItem.appendChild(status);
  const title = document.createElement('div');
  title.className = 'itemTitleText';
  title.innerText = item.title;
  newItem.appendChild(title);
  const remove = document.createElement('div');
  remove.className = 'delete';
  remove.innerText = 'Delete';
  newItem.appendChild(remove);
  return newItem;
};

const changeTemplate = function (todoId) {
  document.querySelector('#input').placeholder = "Add New ITEM here";
  document.querySelector('#addButton').onclick = addNewItem;
  document.querySelector('#goBack').style.display = 'inline';
  document.querySelector('#goBack').onclick =
    removeAllChildren('todoList');
  document.querySelector('.todoList').id = `todoItems-${todoId}`;
};

const renderTodoItems = function (todoId, todoItems) {
  changeTemplate(todoId);
  todoItems.forEach((item) => {
    const todoItem = getItemHTML(todoId, item);
    document.querySelector('.todoList').appendChild(todoItem);
  });
};

const renderEmptyList = function () {
  const noTodo = `<div id='no-todo'>
    You Don't have any TODO !! <br>
    <button class='addNew' style='width: 40%; height: 8vh'> Add TODO </button>
  </div>`;
  return noTodo;
};

const renderTodos = function (todoList) {
  for (let item of todoList) {
    const todo = getTodoHTML(item);
    document.querySelector('.todoList').prepend(todo);
  }
};
