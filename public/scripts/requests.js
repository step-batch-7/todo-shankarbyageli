const deleteTodo = function () {
  const xhr = new XMLHttpRequest();
  const id = event.target.parentElement.id.split('-').pop();
  const body = { id: id };
  xhr.onload = function () {
    document.querySelector(`#todo-${id}`).remove();
    todoList.deleteTodo(id);
  };
  xhr.open('DELETE', '/todo');
  xhr.send(JSON.stringify(body));
};

const deleteTask = function () {
  const xhr = new XMLHttpRequest();
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const body = { todoId, taskId };
  xhr.onload = function () {
    document.querySelector(`#item-${todoId}-${taskId}`).remove();
    todoList.deleteTask(todoId, taskId);
  };
  xhr.open('DELETE', '/task');
  xhr.send(JSON.stringify(body));
};

const isValidInput = function () {
  event.preventDefault();
  const title = document.querySelector('#input').value;
  document.querySelector('#input').value = '';
  if (title.trim() === '') {
    return;
  }
  return title;
}

const addNewTodo = function () {
  const title = extractTitle();
  if (!title) {
    return;
  }
  const xhr = new XMLHttpRequest();
  const body = { title: title };
  xhr.onload = renderNewTodo;
  xhr.open('PUT', '/newTodo');
  xhr.send(JSON.stringify(body));
};

const getItemId = function (element) {
  const id = element.parentElement.previousElementSibling.children[0].id;
  return id.split('-').pop();
};

const addNewItem = function () {
  const title = extractTitle();
  if (!title) {
    return;
  }
  const xhr = new XMLHttpRequest();
  const body = { id: todoId, title: title };
  xhr.onload = function () {
    renderNewItem(this.responseText, todoId);
  }
  xhr.open('PUT', `/newItem`);
  xhr.send(JSON.stringify(body));
};

const changeTaskStatus = function () {
  const [, todoId, taskId] = event.target.parentElement.id.split('-');
  const body = { todoId, taskId };
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    todoList.changeStatus(todoId, taskId);
  };
  xhr.open('PUT', '/taskStatus');
  xhr.send(JSON.stringify(body));
};

const getAllTodos = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const serverList = JSON.parse(this.responseText);
    todoList.addList(serverList);
    renderTodos();
  }
  xhr.open('GET', '/list');
  xhr.send();
};
