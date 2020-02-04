class TodoList {
  constructor(todoList) {
    this.todoList = todoList;
  }

  getTodoList() {
    return this.todoList;
  }

  toString() {
    return JSON.stringify(this.todoList);
  }

  getTodo(id) {
    return this.todoList.find((todo) => {
      return todo.id == id;
    });
  }

  getTasks(todoId) {
    const todo = this.getTodo(todoId);
    return todo.tasks;
  }

  get nextTodoId() {
    const lastTodo = this.todoList[this.todoList.length - 1];
    const nextId = lastTodo ? +lastTodo.id + 1 : 100;
    return nextId;
  }

  nextTaskId(todoId) {
    const tasks = this.getTasks(todoId);
    const lastTask = tasks[tasks.length - 1];
    const lastTaskId = lastTask ? lastTask.id : 1;
    return +lastTaskId + 1;
  }

  deleteTodo(id) {
    const todoIndex = this.todoList.findIndex((todo) => {
      return todo.id == id;
    });
    this.todoList.splice(todoIndex, 1);
  }

  addTodo(title) {
    const id = this.nextTodoId;
    this.todoList.push({
      id: id,
      title: title,
      tasks: [],
      status: false
    });
    return this.todoList[this.todoList.length - 1];
  }

  deleteTask(todoId, itemId) {
    const todo = this.getTodo(todoId);
    const itemIndex = todo.tasks.findIndex((task) => {
      return task.id == itemId;
    });
    todo.tasks.splice(itemIndex, 1);
  }

  addItem(todoId, title) {
    const nextTaskId = this.nextTaskId(todoId);
    const tasks = this.getTasks(todoId);
    const newTask = {
      id: nextTaskId,
      title: title,
      status: false
    }
    tasks.push(newTask);
    return newTask;
  }

  changeStatus(todoId, itemId) {
    const todo = this.getTodo(todoId);
    const task = todo.tasks.find((task) => {
      return task.id == itemId;
    });
    task.status = !task.status;
  }
}

module.exports = TodoList;
