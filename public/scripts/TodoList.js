class TodoList {
  constructor() {
    this.todoList = [];
  }

  addList(list) {
    this.todoList = list;
  }

  addTodo(todo) {
    this.todoList.push(todo);
  }

  addTask(todoId, task) {
    const tasks = this.getTodoItems(todoId);
    tasks.push(task);
  }

  getTodo(id) {
    const todoIndex = this.todoList.findIndex((todo) => {
      return todo.id === +id;
    });
    return this.todoList[todoIndex];
  }

  deleteTask(todoId, taskId) {
    const tasks = this.getTodoItems(todoId);
    const itemIndex = tasks.findIndex((task) => {
      return task.id === +taskId;
    });
    tasks.splice(itemIndex, 1);
  }

  deleteTodo(todoId) {
    const todoIndex = this.todoList.findIndex((todo) => {
      return todo.id === +todoId;
    });
    this.todoList.splice(todoIndex, 1);
  }

  changeStatus(todoId, taskId) {
    const todo = this.getTodo(todoId);
    const task = todo.tasks.find((task) => {
      return task.id === +taskId;
    });
    task.status = !task.status;
  }

  editTodo(todoId, title) {
    const todo = this.getTodo(todoId);
    todo.title = title;
  }

  editTask(todoId, taskId, title) {
    const tasks = this.getTodoItems(todoId);
    const task = tasks.find((task) => {
      return task.id === +taskId;
    });
    task.title = title;
  }

  getTodoItems(todoId) {
    const id = this.todoList.findIndex((todo) => {
      return todo.id === +todoId;
    });
    return this.todoList[id].tasks;
  }
}
