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

const doneTaskEditing = function () {
  const text = event.target.previousSibling;
  text.contentEditable = false;
  event.target.innerText = '✎';
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  editTask(todoId, taskId, text.innerText);
};

const makeTaskEditable = function () {
  const titleNode = event.target.previousSibling;
  titleNode.contentEditable = true;
  titleNode.focus();
  event.target.innerText = '✔';
  event.target.onclick = doneTaskEditing;
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
  const edit = createDivElement('✎', 'edit');
  edit.onclick = makeTaskEditable;
  newItem.appendChild(edit);
  const remove = createDeleteDiv();
  newItem.appendChild(remove);
  return newItem;
};

const getTodoDetails = function (details) {
  const tasks = todoList.getTodoItems(details.id);
  const remaining = tasks.filter((task) => !task.status).length;
  return `Total Tasks: ${tasks.length}\nRemaining: ${remaining}`;
};

const doneTodoEditing = function () {
  const text = event.target.previousSibling;
  text.contentEditable = false;
  event.target.innerText = '✎';
  editTodo(event.target.parentElement.id.split('-').pop(), text.innerText);
};

const makeTodoEditable = function () {
  const titleNode = event.target.previousSibling;
  titleNode.contentEditable = true;
  titleNode.focus();
  event.target.innerText = '✔';
  event.target.onclick = doneTodoEditing;
};

const getTodoHTML = function (details) {
  const todo = document.createElement('li');
  todo.id = `todo-${details.id}`;
  todo.className = 'todo';
  const title = createDivElement(details.title, 'todoTitle', 'todoTitleText');
  title.title = getTodoDetails(details);
  todo.appendChild(title);
  const edit = createDivElement('✎', 'edit');
  edit.onclick = () => makeTodoEditable(editTodo);
  todo.appendChild(edit);
  const view = createDivElement('View', 'view');
  view.onclick = renderTodoTasks;
  todo.appendChild(view);
  const remove = createDivElement('✗', 'delete');
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
  select('#todo').scrollTop = select('#todo').scrollHeight;
};

const removeAllChildren = function (className) {
  const element = select(`.${className}`);
  while (element.children.length) {
    element.children[0].remove();
  }
};

const isSearchedElement = function (title, searchText) {
  let keywords = searchText.split(' ');
  keywords = keywords.filter(keyword => keyword);
  return keywords.every(keyword => title.includes(keyword));
};

const filterTodo = function () {
  const searchText = select('#searchBar').value;
  const elements = todoList.list;
  elements.forEach((element) => {
    if (isSearchedElement(element.title, searchText)) {
      select(`#todo-${element.id}`).style.display = '';
    } else {
      select(`#todo-${element.id}`).style.display = 'none';
    }
  });
};

const filterTasks = function () {
  const searchText = select('#searchBar').value;
  const todoId = select('.todoList').id.split('-').pop();
  const elements = todoList.getTodoItems(todoId);
  elements.forEach((element) => {
    if (isSearchedElement(element.title, searchText)) {
      select(`#item-${todoId}-${element.id}`).style.display = '';
    } else {
      select(`#item-${todoId}-${element.id}`).style.display = 'none';
    }
  });
};

const todoTemplate = function () {
  select('#input').placeholder = 'Add New TODO here';
  select('#text').innerText = 'Your TODO List';
  select('#text').title = 'Your TODO List';
  select('#searchBar').placeholder = 'Search Todo...';
  select('#searchBar').value = '';
  select('#searchBar').oninput = filterTodo;
  select('#addButton').onclick = addNewTodo;
  select('#goBack').style.display = 'none';
  removeAllChildren('todoList');
  select('.todoList').id = '';
  renderTodos();
};

const taskTemplate = function (todoId) {
  select('#input').placeholder = 'Add New TASK here';
  select('#text').innerText = todoList.getTodo(todoId).title;
  select('#searchBar').placeholder = 'Search Task...';
  select('#searchBar').value = '';
  select('#searchBar').oninput = filterTasks;
  select('#text').title = select('#text').innerText;
  select('#addButton').onclick = addNewItem;
  select('#goBack').style.display = 'inline';
  select('#goBack').onclick = todoTemplate;
  removeAllChildren('todoList');
  select('.todoList').id = `todoItems-${todoId}`;
};

const renderTodoTasks = function () {
  const id = event.target.parentElement.id.split('-').pop();
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
