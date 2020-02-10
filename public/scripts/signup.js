const select = document.querySelector.bind(document);

const getFormBody = function () {
  const body = {};
  body.username = select('input[name=username]').value;
  body.email = select('input[name=email]').value;
  body.passwd = select('input[name=passwd]').value;
  return body;
};

const handleResponse = function () {
  const res = JSON.parse(this.responseText);
  if (res.userNameError) {
    select('#userNameError').innerText = res.userNameError;
    return;
  }
  if (res.emailError) {
    select('#emailError').innerText = res.emailError;
    return;
  }
};

const sendData = function (body) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup');
  xhr.send(JSON.stringify(body));
  xhr.onload = handleResponse;
};

const validateInput = function () {
  event.preventDefault();
  select('#userNameError').innerText = '';
  select('#emailError').innerText = '';
  const body = getFormBody();
  const repasswd = select('input[name=re-passwd]').value;
  if (body.passwd !== repasswd) {
    alert('Both passwords don\'t match');
    return;
  }
  sendData(body);
};
