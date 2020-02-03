const parseUrl = function (urlString) {
  let [url, query] = urlString.split('?');
  query = query.split('&');
  const queryObject = query.reduce((parsedQuery, query) => {
    const [key, value] = query.split('=');
    parsedQuery[key] = value;
    return parsedQuery;
  }, {});
  return [url, queryObject];
};

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
    if (req.url.includes('?')) {
      [req.url, req.query] = parseUrl(req.url);
    }
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
