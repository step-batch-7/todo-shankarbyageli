class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware });
  }
  serve(req, res) {
    const matchingHandlers = this.routes.filter((route) => {
      return matchRoute(route, req);
    });
    const next = function () {
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

const matchRoute = function (route, req) {
  if (route.method) {
    const regex = new RegExp(`^${route.path}$`);
    return req.method === route.method &&
      (route.path === '' || req.url.match(regex));
  }
  return true;
};

module.exports = App;
