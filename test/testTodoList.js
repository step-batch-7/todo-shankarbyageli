const TodoList = require('../lib/TodoList');
const assert = require('assert');

describe('TodoList', function () {
  describe('getTodoList', function () {
    it('should give the list of all todos', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const list = todoList.getTodoList();
      assert.deepStrictEqual(list, [{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });

  describe('toString', function () {
    it('should give the string representation of the todo', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const actual = todoList.toString();
      assert.strictEqual(actual, JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }]));
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
    it('description', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2, tasks: [{ id: 1 }, { id: 2 }] }]);
      const actual = todoList.nextTaskId(2);
      assert.strictEqual(actual, 3);
    });
  });

  describe('deleteTodo', function () {
    it('description', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }]);
      todoList.deleteTodo(1);
      assert.deepStrictEqual(todoList.getTodoList(), [{ id: 2 }]);
    });
  });

  describe('deleteTask', function () {
    it('description', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2, tasks: [{ id: 1 }, { id: 2 }] }]);
      todoList.deleteTask(2, 1);
      assert.deepStrictEqual(todoList.getTodoList(), [{ id: 1 }, { id: 2, tasks: [{ id: 2 }] }]);
    });
  });

  describe('addTodo', function () {
    it('description', function () {
      const todoList = new TodoList([{ id: 1 }, { id: 2 }]);
      const actual = todoList.addTodo('new todo');
      const expected = { id: 3, title: 'new todo', status: false, tasks: [] };
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('addItem', function () {
    it('description', function () {
      const todoList = new TodoList([{ id: 1, tasks: [] }]);
      const actual = todoList.addItem(1, 'new todo');
      const expected = { id: 2, title: 'new todo', status: false };
      assert.deepStrictEqual(actual, expected);
      const list = [{ id: 1, tasks: [{ id: 2, title: 'new todo', status: false }] }];
      assert.deepStrictEqual(todoList.getTodoList(), list);
    });
  });

  describe('changeStatus', function () {
    it('description', function () {
      const todoList = new TodoList([{ id: 1, tasks: [{ id: 2, title: 'new todo', status: false }] }]);
      const actual = todoList.changeStatus(1, 2);
      const list = [{ id: 1, tasks: [{ id: 2, title: 'new todo', status: true }] }];
      assert.deepStrictEqual(todoList.getTodoList(), list);
    });
  });
});
