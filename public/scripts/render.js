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
  tasks.forEach(task => {
    select(`#item-${todoId}-${task.id}`).children[1].style['font-weight'] = '600';
  });
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

const showTasksList = function (element, tasks) {
  element.innerText = '';
  tasks.forEach(task => {
    element.innerHTML += `■ ${task.title} <br>`;
  });
  element.style.display = 'block';
  element.style.top = `${event.clientY}px`;
  element.style.left = '700px';
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
  element.onclick = function () {
    const todoId = element.parentElement.id.split('-').pop();
    const request = createRequest('GET', `/todo?todoId=${todoId}`, {});
    xmlRequest(request, function () {
      const todo = JSON.parse(this.responseText);
      renderTodoTasks(todo);
      highlightSelectedTasks(todoId, tasks);
    });
  }
};

const todoTemplate = function () {
  select('#input').placeholder = 'Add New TASK here';
  select('#taskName').style.display = 'none';
  select('#todoSearch').style.display = '';
  select('#todoSearch').value = '';
  select('#taskSearch').value = '';
  select('#todoSearch').onfocus = () =>
    initiateTaskSearch(filterTodo);
  select('#taskSearch').onfocus = () =>
    initiateTaskSearch(filterTasksInTodo);
  select('#addButton').onclick = addNewTodo;
  select('#goBack').style.visibility = 'hidden';
  removeAllChildren('todoList');
  select('.todoList').id = '';
  select('#selectedTasks').style.display = 'none';
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
  select('#taskSearch').onfocus = null;
  select('#taskSearch').oninput = filterTasks;
  select('#addButton').onclick = addNewItem;
  select('#goBack').style.visibility = 'visible';
  select('#goBack').onclick = goBack;
  removeAllChildren('todoList');
  select('.todoList').id = `todoItems-${todo.id}`;
  select('#selectedTasks').style.display = 'none';
};

const renderTasks = function (id, tasks) {
  for (const task of tasks) {
    const taskHTML = getItemHTML(id, task);
    if (task.status) {
      taskHTML.children[1].style['text-decoration'] = 'line-through';
    }
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
