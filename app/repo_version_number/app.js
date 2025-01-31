import { readTextFile } from "../../gears/modules/js_xhr_ajax/xhr_ajax.js";


const selector = {
  branch: document.getElementById('branch'),
  buttonCheck: document.getElementById('check'),
  directory: document.getElementById('directory'),
  inputForm: document.getElementById('input-form'),
  repository: document.getElementById('repository'),
  result: document.getElementById('result'),
  username: document.getElementById('username'),
};


function notValid() {
  selector.result.innerText = 'You haven\'t entered the required text!';
}
function doIt() {
  let branch = selector.branch.value;
  let dir = selector.directory.value;
  const repo = selector.repository.value;
  const user = selector.username.value;

  selector.result.innerText = 'Loading...';

  if (user === '' || repo === '') {
    notValid();
    return;
  }

  if (dir !== '')
    dir += '/';
  if (branch === '')
    branch = 'main';

  readTextFile(
    {url: `https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${branch}/${dir}version`},
    result => {
      if (typeof result === 'string')
        selector.result.innerText = result;
      else if (typeof result === 'object')
        selector.result.innerText = result.response;
    }
  );
}


selector.buttonCheck.addEventListener('click', doIt);
selector.inputForm.addEventListener('submit', (e) => {e.preventDefault()});