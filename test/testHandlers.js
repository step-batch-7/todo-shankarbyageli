const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handlers.js');
const { STATUS_CODES } = require('../lib/utilities.js');

after(() => {
  const todo = [
    {
      'id': 100,
      'title': 'todo 1',
      'tasks': [
        {
          'id': 1,
          'title': 'task 1',
          'status': false
        },
        {
          'id': 2,
          'title': 'task 2',
          'status': false
        }
      ],
      'status': false
    },
    {
      'id': 101,
      'title': 'todo 2',
      'tasks': [],
      'status': false
    },
    {
      'id': 102,
      'title': 'todo 3',
      'tasks': [],
      'status': false
    }
  ];
  fs.writeFileSync(process.env.DATABASE, JSON.stringify(todo));
});

describe('GET /staticPage', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', 'text/css')
      .expect(/title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /list', function () {
  it('responds with list of existing todos', function (done) {
    request(app.serve.bind(app))
      .get('/list')
      .set('Accept', 'application/json')
      .expect(/title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /todo', function () {
  it('responds with the todo of the given id', function (done) {
    request(app.serve.bind(app))
      .get('/todo?todoId=100')
      .set('Accept', 'application/json')
      .expect(/todo 1/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('POST /newTodo', function () {
  it('responds with newly added todo object', function (done) {
    request(app.serve.bind(app))
      .post('/newTodo')
      .send({ title: 'new title' })
      .set('Accept', 'application/json')
      .expect(/new title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('POST /newItem', function () {
  it('responds with newly added task object', function (done) {
    request(app.serve.bind(app))
      .post('/newItem')
      .send({ id: 100, title: 'new title' })
      .set('Accept', 'application/json')
      .expect(/new title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('HEAD /url', function () {
  it('responds with 400 method not allowed', function (done) {
    request(app.serve.bind(app))
      .head('/url')
      .expect(STATUS_CODES.notAllowed, done);
  });
});

describe('PUT /taskStatus', function () {
  it('change the status of the given task', function (done) {
    request(app.serve.bind(app))
      .put('/taskStatus')
      .send({ todoId: 100, taskId: 1 })
      .expect(/true/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('DELETE /todo', function () {
  it('delete the todo with the give id', function (done) {
    request(app.serve.bind(app))
      .delete('/todo')
      .send({ id: 102 })
      .expect(/100/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('DELETE /task', function () {
  it('delete the task with the given todoId and taskId', function (done) {
    request(app.serve.bind(app))
      .delete('/task')
      .send({ todoId: 100, taskId: 2 })
      .expect(/task 1/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('PUT /editTodo', function () {
  it('edits the title of the given todoId', function (done) {
    request(app.serve.bind(app))
      .put('/editTodo')
      .send({ todoId: 100, title: 'edited title' })
      .expect(/edited title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('PUT /editTask', function () {
  it('edits the title of the task given todoId and taskId', function (done) {
    request(app.serve.bind(app))
      .put('/editTask')
      .send({ todoId: 100, taskId: 1, title: 'edited title' })
      .expect(/edited title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /badRequest', function () {
  it('responds 404 not found', function (done) {
    request(app.serve.bind(app))
      .get('/badRequest')
      .expect('Not Found')
      .expect(STATUS_CODES.notFound, done);
  });
});
