const doneTaskEditing = function () {
  const text = event.target;
  text.contentEditable = false;
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  editTask(todoId, taskId, text.innerText);
};

const makeTitleEditable = function () {
  const titleNode = event.target;
  titleNode.contentEditable = true;
  titleNode.focus();
};

const highlightSelectedTasks = function (todoId, tasks) {
  const allTasks = todoList.getTodoItems(todoId);
  renderTasks(todoId, allTasks);
  tasks.forEach(task => {
    select(`#item-${todoId}-${task.id}`).children[1].style['font-weight'] = '500';
  });
};

const showMatchingTasks = function (tasks) {
  const todoId = event.target.parentElement.id.split('-').pop();
  taskTemplate(todoId);
  highlightSelectedTasks(todoId, tasks);
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

const getTodoDetails = function (details) {
  const tasks = details.tasks;
  const remaining = tasks.filter((task) => !task.status).length;
  return `Total Tasks: ${tasks.length}\nRemaining: ${remaining}`;
};

const doneTodoEditing = function () {
  const text = event.target;
  text.contentEditable = false;
  editTodo(event.target.parentElement.id.split('-').pop(), text.innerText);
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

const renderNewTodo = function () {
  renderEmptyList();
  const details = JSON.parse(this.responseText);
  renderTodos(details);
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

const clearOtherSearch = function () {
  select('#todoSearch').value = '';
};

const isSearchedElement = function (title, searchText) {
  let keywords = searchText.split(' ');
  keywords = keywords.filter(keyword => keyword);
  return keywords.every(keyword => title.includes(keyword));
};

const filterTodo = function () {
  const searchText = select('#todoSearch').value;
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
  const searchText = select('#taskSearch').value;
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

const getAllMatchingTasks = function (searchText) {
  const todo = todoList.list;
  const elements = todo.reduce((elements, t) => {
    const tasks = todoList.getTodoItems(t.id);
    elements[t.id] = tasks;
    return elements;
  }, {});
  const matchingTasks = [];
  for (let element in elements) {
    const matching = elements[element].filter(task => {
      return isSearchedElement(task.title, searchText);
    });
    matchingTasks.push([element, matching]);
  }
  return matchingTasks;
};

const showTasksList = function (element, tasks) {
  element.innerText = '';
  tasks.forEach(task => {
    element.innerHTML += `■ ${task.title} <br>`;
  });
  element.style.display = 'block';
  element.style.top = `${event.clientY}px`;
  element.style.left = `600px`;
};

const hideTasksList = function () {
  select('#selectedTasks').style.display = 'none';
};

const showSelectedTaskList = function (element, tasks) {
  element.setAttribute('data-match', `${tasks.length} matching tasks`);
  element.classList.add('matches');
  const taskList = select('#selectedTasks');
  element.onmouseover = showTasksList.bind(null, taskList, tasks);
  element.onmouseout = hideTasksList;
  element.onclick = showMatchingTasks.bind(null, tasks);
};

const filterTasksInTodo = function () {
  const searchText = select('#taskSearch').value;
  const matchingTasks = getAllMatchingTasks(searchText);
  matchingTasks.forEach(match => {
    select(`#todo-${match[0]}`).style.display = '';
    if (searchText.trim() === '') {
      select(`#todo-${match[0]}`).firstChild.classList.remove('matches');
      select(`#todo-${match[0]}`).firstChild.onclick = makeTitleEditable;
      todoTemplate();
      return;
    }
    select(`#todo-${match[0]}`).firstChild.onclick = null;
    if (match[1].length) {
      showSelectedTaskList(select(`#todo-${match[0]}`).firstChild, match[1]);
      return;
    }
    select(`#todo-${match[0]}`).style.display = 'none';
  });
};

const todoTemplate = function () {
  select('#input').placeholder = 'Add New TASK here';
  select('#taskName').style.display = 'none';
  select('#todoSearch').style.display = '';
  select('#todoSearch').value = '';
  select('#taskSearch').value = '';
  select('#todoSearch').oninput = filterTodo;
  select('#taskSearch').oninput = filterTasksInTodo;
  select('#addButton').onclick = addNewTodo;
  select('#goBack').style.visibility = 'hidden';
  removeAllChildren('todoList');
  select('.todoList').id = '';
};

const goBack = function () {
  todoTemplate();
  getAllTodos();
};

const taskTemplate = function (todo) {
  select('#input').placeholder = 'Add New TASK here';
  select('#todoSearch').style.display = 'none';
  select('#taskName').style.display = 'inline';
  select('#taskName').innerText = `Title: ${todo.title}`;
  select('#taskSearch').oninput = filterTasks;
  select('#addButton').onclick = addNewItem;
  select('#goBack').style.visibility = 'visible';
  select('#goBack').onclick = goBack;
  removeAllChildren('todoList');
  select('.todoList').id = `todoItems-${todo.id}`;
};

const renderTasks = function (id, tasks) {
  for (const task of tasks) {
    const taskHTML = getItemHTML(id, task);
    select('.todoList').appendChild(taskHTML);
  }
  renderEmptyList();
};

const renderTodoTasks = function (todo) {
  taskTemplate(todo);
  const tasks = todo.tasks;
  renderTasks(todo.id, tasks);
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

const renderTodos = function (todoList) {
  removeAllChildren('todoList');
  for (const item of todoList) {
    const todo = getTodoHTML(item);
    select('.todoList').prepend(todo);
  }
  renderEmptyList();
};
