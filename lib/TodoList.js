class TodoList {
  constructor(todoList) {
    this.todoList = todoList;
    this.nextId = this.getNextId() || 100;
  }

  toString() {
    return JSON.stringify(this.todoList);
  }

  getNextId() {
    const existingIds = Object.keys(this.todoList);
    const lastId = existingIds[existingIds.length - 1];
    return +lastId + 1;
  }

  getItems(id) {
    return this.todoList[id].todos;
  }

  get todos() {
    return this.todoList;
  }

  delete(id) {
    delete this.todoList[id];
    return id;
  }

  addNewTodo(title) {
    const id = this.nextId;
    this.todoList[id] = {
      title: title,
      todos: [],
      status: false
    };
    this.nextId++;
    return id;
  }

  getTodo(id) {
    return this.todoList[id];
  }
}

module.exports = TodoList;
