const STATUS_CODES = {
  'success': 200,
  'redirect': 301,
  'notFound': 404,
  'notAllowed': 400
};

const CONTENT_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

module.exports = {
  STATUS_CODES,
  CONTENT_TYPES,
};
