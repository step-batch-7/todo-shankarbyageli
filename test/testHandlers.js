const fs = require('fs');
const sinon = require('sinon');
const { assert } = require('sinon');
const request = require('supertest');
const app = require('../lib/handlers.js');
const { STATUS_CODES } = require('../lib/utilities.js');

const todoList = [
  {
    id: 100,
    title: 'todo 1',
    tasks: [
      {
        id: 1,
        title: 'task 1',
        status: false
      },
      {
        id: 2,
        title: 'task 2',
        status: false
      }
    ],
    status: false
  },
  {
    id: 101,
    title: 'todo 2',
    tasks: [],
    status: false
  }
];

const readFake = sinon.fake.returns(JSON.stringify(todoList));
const writeFake = sinon.fake();

before(() => {
  sinon.replace(fs, 'readFileSync', readFake);
  sinon.replace(fs, 'writeFileSync', writeFake);
});

after(() => {
  sinon.restore();
});

describe('GET /staticPage', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .get('/style.css')
      .set('Accept', 'text/css')
      .expect(/title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /list', function () {
  it('responds with list of existing todos', function (done) {
    request(app.serve.bind(app))
      .get('/list')
      .set('Accept', 'text/plain')
      .expect(/title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('POST /newTodo', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .post('/newTodo')
      .send({ title: "new title" })
      .set('Accept', 'text/css')
      .expect(/new title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('POST /newItem', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .post('/newItem')
      .send({ id: 100, title: "new title" })
      .set('Accept', 'text/css')
      .expect(/new title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('HEAD /url', function () {
  it('responds with 400 method not allowed', function (done) {
    request(app.serve.bind(app))
      .put('/url')
      .expect(STATUS_CODES.notAllowed, done);
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
