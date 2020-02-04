const createDivElement = function (innerText, id, className) {
  const div = document.createElement('div');
  div.innerText = innerText;
  div.id = id;
  div.className = className;
  return div;
};

const createCheckBox = function () {
  const status = document.createElement('input');
  status.type = 'checkBox';
  status.className = 'status';
  return status;
};

const createDeleteDiv = function () {
  const remove = document.createElement('div');
  remove.className = 'delete';
  remove.innerText = 'Delete';
  remove.onclick = deleteTask;
  return remove;
};

const createTitleDiv = function (className, text) {
  const title = document.createElement('div');
  title.className = className;
  title.innerText = text;
  title.title = text;
  return title;
};

const getItemHTML = function (todoId, item) {
  const newItem = document.createElement('li');
  newItem.id = `item-${todoId}-${item.id}`;
  newItem.className = 'item';
  const status = createCheckBox();
  status.checked = item.status;
  status.onclick = changeTaskStatus;
  newItem.appendChild(status);
  const title = createTitleDiv('itemTitleText', item.title);
  newItem.appendChild(title);
  const remove = createDeleteDiv();
  newItem.appendChild(remove);
  return newItem;
};

const getTodoHTML = function (details) {
  const todo = document.createElement('li');
  todo.id = `todo-${details.id}`;
  todo.className = 'todo';
  const title = createDivElement(details.title, 'todoTitle', 'todoTitleText');
  title.title = details.title;
  todo.appendChild(title);
  const view = createDivElement('View', `view-${details.id}`, 'view');
  view.onclick = renderTodoTasks;
  todo.appendChild(view);
  const remove = createDivElement('Delete', `delete-${details.id}`, 'delete');
  remove.onclick = deleteTodo;
  todo.appendChild(remove);
  return todo;
};

const renderNewTodo = function () {
  renderEmptyList();
  const details = JSON.parse(this.responseText);
  todoList.addTodo(details);
  const todo = getTodoHTML(details);
  select('.todoList').prepend(todo);
};

const renderNewItem = function (responseText, todoId) {
  renderEmptyList();
  const details = JSON.parse(responseText);
  todoList.addTask(todoId, details);
  const item = getItemHTML(todoId, details);
  select('.todoList').appendChild(item);
};

const removeAllChildren = function (className) {
  const element = select(`.${className}`);
  while (element.children.length) {
    element.children[0].remove();
  }
};

const todoTemplate = function () {
  select('#input').placeholder = 'Add New TODO here';
  select('#text').innerText = 'Your TODO List';
  select('#addButton').onclick = addNewTodo;
  select('#goBack').style.display = 'none';
  removeAllChildren('todoList');
  select('.todoList').id = '';
  renderTodos();
};

const taskTemplate = function (todoId) {
  select('#input').placeholder = 'Add New TASK here';
  select('#text').innerText = todoList.getTodo(todoId).title;
  select('#addButton').onclick = addNewItem;
  select('#goBack').style.display = 'inline';
  select('#goBack').onclick = todoTemplate;
  removeAllChildren('todoList');
  select('.todoList').id = `todoItems-${todoId}`;
};

const renderTodoTasks = function () {
  const id = event.target.id.split('-').pop();
  taskTemplate(id);
  const tasks = todoList.getTodoItems(id);
  for (const task of tasks) {
    const taskHTML = getItemHTML(id, task);
    select('.todoList').appendChild(taskHTML);
  }
  renderEmptyList();
};

const renderEmptyList = function () {
  const list = select('.todoList');
  if (!list.children.length) {
    const noTodo = document.createElement('div');
    noTodo.id = 'no-todo';
    noTodo.innerText = 'No Items Yet';
    list.appendChild(noTodo);
    return;
  }
  if (list.children[0].id === 'no-todo') {
    list.children[0].remove();
  }
};

const renderTodos = function () {
  for (const item of todoList.todoList) {
    const todo = getTodoHTML(item);
    select('.todoList').prepend(todo);
  }
  renderEmptyList();
};
