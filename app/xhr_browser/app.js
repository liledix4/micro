import { readTextFile } from "../../gears/modules/js_xhr_ajax/xhr_ajax.js";


const selector = {
  buttonGo: document.getElementById('go'),
  input: document.getElementById('input'),
  inputMethod: document.getElementById('method'),
  inputMethodQuery: document.getElementById('method_query'),
  inputURL: document.getElementById('url'),
  result: document.getElementById('result'),
  status: document.getElementById('status'),
};


function rejected() {
  alert('Incorrect input');
}
selector.input.addEventListener('submit', (event) => {
  event.preventDefault();
  let url = selector.inputURL.value;
  const method = selector.inputMethod.value;
  const methodQuery = selector.inputMethodQuery.value;
  let send = null;
  let xhrObject = {};

  if (url === '') {
    rejected();
    return;
  }

  if (!url.match(/^https:\/\// && !url.match(/^\w:\/\//)))
    url = 'https://' + url;
  xhrObject.url = url;

  if (method === '')
    xhrObject.method = 'get';

  if (methodQuery !== '')
    send = methodQuery;

  readTextFile(
    xhrObject,
    result => {
      if (typeof result === 'object') {
        selector.status.innerText = result.status;
        selector.result.innerText = result.response;
      }
      else {
        selector.status.innerText = '200';
        selector.result.innerText = result;
      }
    },
    send
  );
});