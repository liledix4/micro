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
  selector.status.innerText = '___';

  let url = selector.inputURL.value;
  const method = selector.inputMethod.value;
  const methodQuery = selector.inputMethodQuery.value;
  let send = null;
  let xhrObject = {};

  if (url === '') {
    rejected();
    return;
  }

  if (!url.match(/^https:\/\//) && !url.match(/^\w+:\/\//))
    url = 'https://' + url;
  xhrObject.url = url;

  if (method === '')
    xhrObject.method = 'get';

  if (methodQuery !== '')
    send = methodQuery;

  try {
    readTextFile(
      xhrObject,
      result => {
        if (typeof result === 'object') {
          if (result.status === 0) {
            selector.status.innerText = '???';
            selector.result.innerText = 'Error.\nEither your URL is incorrect or resource is unavailable due to CORS policy.\nSome web servers may reject XHR requests.\n\nPress F12 or Ctrl+Shift+I to see more details.';
          }
          else {
            selector.status.innerText = result.status;
            selector.result.innerText = result.response;
          }
        }
        else {
          selector.status.innerText = '200';
          selector.result.innerText = result;
        }
      },
      send
    );
  } catch (error) {
    selector.status.innerText = 'ERR';
    selector.result.innerText = error;
  }
});