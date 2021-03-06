const TodoList = require('../lib/TodoList');
const assert = require('assert');

describe('TodoList', function () {
  describe('getTodoList', function () {
    it('should give the list of all todos', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const list = todoList.list;
      assert.deepStrictEqual(list, [{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });

  describe('getTodo', function () {
    it('should give the todo of the given id', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const actual = todoList.getTodo(2);
      assert.deepStrictEqual(actual, { id: 2 });
    });
  });

  describe('getTasks', function () {
    it('should give the tasks of the given todoId', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2, tasks: [{ id: 1 }, { id: 2 }] }]);
      const actual = todoList.getTasks(2);
      assert.deepStrictEqual(actual, [{ id: 1 }, { id: 2 }]);
    });
  });

  describe('nextTodoId', function () {
    it('should give the next todoId', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 4 }]);
      const actual = todoList.nextTodoId;
      assert.strictEqual(actual, 5);
    });

    it('should give the todo id as 100 if no todo exist', function () {
      const todoList = new TodoList([]);
      const actual = todoList.nextTodoId;
      assert.strictEqual(actual, 100);
    });
  });

  describe('nextTaskId', function () {
    it('should give the next task id of given todoId', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2, tasks: [{ id: 1 }, { id: 2 }] }]);
      const actual = todoList.nextTaskId(2);
      assert.strictEqual(actual, 3);
    });
  });

  describe('deleteTodo', function () {
    it('should delete the todo of the given id', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }]);
      todoList.deleteTodo(1);
      assert.deepStrictEqual(todoList.list, [{ id: 2 }]);
    });
  });

  describe('deleteTask', function () {
    it('should delete the give task id of the given todoId', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2, tasks: [{ id: 1 }, { id: 2 }] }]);
      todoList.deleteTask(2, 1);
      assert.deepStrictEqual(todoList.list, [{ id: 1 }, { id: 2, tasks: [{ id: 2 }] }]);
    });
  });

  describe('addTodo', function () {
    it('should add the new todo given the title of the todo', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }]);
      const actual = todoList.addTodo('new todo');
      const expected = { id: 3, title: 'new todo', status: false, tasks: [] };
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('addItem', function () {
    it('should add the given task to the given todoId', function () {
      const todoList = new TodoList([{ id: 1, tasks: [] }]);
      const actual = todoList.addItem(1, 'new todo');
      const expected = { id: 2, title: 'new todo', status: false };
      assert.deepStrictEqual(actual, expected);
      const list = [{ id: 1, tasks: [{ id: 2, title: 'new todo', status: false }] }];
      assert.deepStrictEqual(todoList.list, list);
    });
  });

  describe('changeStatus', function () {
    it('should change the status of the given task', function () {
      const todoList = new TodoList([{ id: 1, tasks: [{ id: 2, title: 'new todo', status: false }] }]);
      const actual = todoList.changeStatus(1, 2);
      const list = [{ id: 1, tasks: [{ id: 2, title: 'new todo', status: true }] }];
      assert.deepStrictEqual(todoList.list, list);
    });
  });

  describe('editTodo', function () {
    it('should edit the title of the given todo', function () {
      const todoList = new TodoList([{ id: 1, title: 'todo 1', tasks: [] }]);
      todoList.editTodo(1, 'edited title');
      assert.strictEqual(todoList.getTodo(1).title, 'edited title');
    });
  });

  describe('editTask', function () {
    it('should edit the title of the task given todo', function () {
      const todoList = new TodoList([{ id: 1, tasks: [{ id: 2, title: 'new todo', status: false }] }]);
      todoList.editTask(1, 2, 'edited title');
      assert.deepStrictEqual(todoList.getTasks(1), [{ id: 2, title: 'edited title', status: false }]);
    });
  });
});
