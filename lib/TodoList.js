class TodoList {
  constructor(todoList) {
    this.todoList = todoList;
    this.nextId = 100;
  }

  toString() {
    return JSON.stringify(this.todoList);
  }

  get todos() {
    return this.todoList;
  }

  addNewTodo(title) {
    const id = this.nextId;
    this.todoList[id] = {
      title: title,
      todos: [],
      status: false
    }
    this.nextId++;
    return id;
  }

  getTodo(id) {
    return this.todoList[id];
  }
}

module.exports = TodoList;