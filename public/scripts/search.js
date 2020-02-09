const isSearchedElement = function (title, searchText) {
  let keywords = searchText.split(' ');
  keywords = keywords.filter(keyword => keyword);
  return keywords.every(keyword => title.includes(keyword));
};

const filterTodo = function (todo) {
  const searchText = select('#todoSearch').value;
  todo.forEach((element) => {
    if (isSearchedElement(element.title, searchText)) {
      select(`#todo-${element.id}`).style.display = '';
    } else {
      select(`#todo-${element.id}`).style.display = 'none';
    }
  });
};

const filterTasks = function () {
  const todoId = select('.todoList').id.split('-').pop();
  const request = createRequest('GET', `/todo?todoId=${todoId}`, {});
  xmlRequest(request, function (todo) {
    const { tasks } = todo;
    const searchText = select('#taskSearch').value;
    tasks.forEach((element) => {
      if (isSearchedElement(element.title, searchText)) {
        select(`#item-${todoId}-${element.id}`).style.display = '';
      } else {
        select(`#item-${todoId}-${element.id}`).style.display = 'none';
      }
    });
  });
};

const getAllMatchingTasks = function (searchText, todo) {
  const elements = todo.reduce((elements, t) => {
    const tasks = t.tasks;
    elements[t.id] = tasks;
    return elements;
  }, {});
  const matchingTasks = [];
  for (const element in elements) {
    const matching = elements[element].filter(task => {
      return isSearchedElement(task.title, searchText);
    });
    matchingTasks.push([element, matching]);
  }
  return matchingTasks;
};

const resetTasks = function () {
  select(`#todo-${match[0]}`).firstChild.classList.remove('matches');
  select(`#todo-${match[0]}`).firstChild.onclick = makeTitleEditable;
  todoTemplate();
};

const renderSearchResult = function (searchText, task) {
  select(`#todo-${task[0]}`).style.display = '';
  if (searchText.trim() === '') {
    resetTasks();
    return;
  }
  select(`#todo-${task[0]}`).firstChild.onclick = null;
  if (task[1].length) {
    showSelectedTaskList(select(`#todo-${task[0]}`).firstChild, task[1]);
    return;
  }
  select(`#todo-${task[0]}`).style.display = 'none';
};

const filterTasksInTodo = function (todoList) {
  const searchText = select('#taskSearch').value;
  if (searchText.trim() == '') {
    return renderTodos(todoList);
  }
  const matchingTasks = getAllMatchingTasks(searchText, todoList);
  matchingTasks.forEach((task) => renderSearchResult(searchText, task));
};

const initiateTaskSearch = function (filter) {
  if (event.target.id === 'taskSearch') {
    select('#todoSearch').value = '';
  } else {
    select('#taskSearch').value = '';
  }
  const request = createRequest('GET', '/list', {});
  const searchBar = event.target;
  xmlRequest(request, function (allTodoData) {
    searchBar.oninput = filter.bind(null, allTodoData);
  });
};
