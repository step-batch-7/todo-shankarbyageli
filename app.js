// const parseUrl = function (urlString) {
//   let [url, query] = urlString.split('?');
//   if (query) {
//     query = query.split('&');
//     const parsed = {};
//     query.reduce((parsed, query) => {
//       let [key, value] = query.split('=');
//       parsed[key] = value;
//       return parsed;
//     }, parsed);
//     return [url, parsed];
//   }
//   return [url, query];
// };

class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  delete(path, handler) {
    this.routes.push({ path, handler, method: 'DELETE' });
  }
  put(path, handler) {
    this.routes.push({ path, handler, method: 'PUT' });
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
