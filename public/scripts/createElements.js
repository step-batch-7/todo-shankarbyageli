const createDivElement = function (innerText, className) {
  const div = document.createElement('div');
  div.innerText = innerText;
  div.className = className;
  return div;
};

const createCheckBox = function () {
  const status = document.createElement('input');
  status.type = 'checkBox';
  status.className = 'status';
  return status;
};

const createDeleteDiv = function () {
  const remove = document.createElement('div');
  remove.className = 'delete';
  remove.innerText = '✗';
  remove.onclick = deleteTask;
  return remove;
};

const createTitleDiv = function (className, text) {
  const title = document.createElement('div');
  title.className = className;
  title.innerText = text;
  title.title = text;
  return title;
};
