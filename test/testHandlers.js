const request = require('supertest');
const { STATUS_CODES } = require('../lib/utilities');
const app = require('../lib/handlers');

describe('GET /staticPage', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .get('/style.css')
      .set('Accept', 'text/css')
      .expect(/body/)
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

describe('PUT /newTodo', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .put('/newTodo')
      .send('new title')
      .set('Accept', 'text/css')
      .expect(/new title/)
      .expect(STATUS_CODES.success, done);
  });
});

describe('DELETE /deleteTodo', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .delete('/todo')
      .send('102')
      .set('Accept', 'text/css')
      .expect('102')
      .expect(STATUS_CODES.success, done);
  });
});

describe('PUT /url', function () {
  it('responds with 400 method not allowed', function (done) {
    request(app.serve.bind(app))
      .put('/html/Ageratum.html')
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
