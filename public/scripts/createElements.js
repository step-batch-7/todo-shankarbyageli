const createDivElement = function (innerText, className) {
  const div = document.createElement('div');
  div.innerText = innerText;
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
  remove.innerText = '✗';
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

const getTodoHTML = function (details) {
  const todo = document.createElement('li');
  todo.id = `todo-${details.id}`;
  todo.className = 'todo';
  const title = createDivElement(details.title, 'todoTitle', 'todoTitleText');
  title.title = getTodoDetails(details);
  title.onclick = makeTitleEditable;
  title.onblur = doneTodoEditing;
  todo.appendChild(title);
  const view = createDivElement('Tasks', 'view');
  view.onclick = getTasks;
  todo.appendChild(view);
  const remove = createDivElement('✗', 'delete');
  remove.onclick = deleteTodo;
  todo.appendChild(remove);
  return todo;
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
  title.onclick = makeTitleEditable;
  title.onblur = doneTaskEditing;
  newItem.appendChild(title);
  const remove = createDeleteDiv();
  newItem.appendChild(remove);
  return newItem;
};
