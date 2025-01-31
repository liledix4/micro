import { readTextFile } from "../../gears/modules/js_xhr_ajax/xhr_ajax.js";


const selector = {
  branch: document.getElementById('branch'),
  button: {
    check: document.getElementById('check'),
  },
  checkbox: {
    cached: document.getElementById('cached'),
  },
  directory: document.getElementById('directory'),
  inputForm: document.getElementById('input_form'),
  liledix4Presets: document.getElementById('liledix4_presets'),
  repository: document.getElementById('repository'),
  result: document.getElementById('result'),
  username: document.getElementById('username'),
};


selector.button.check.addEventListener('click', doIt);
selector.inputForm.addEventListener('submit', (e) => {e.preventDefault()});
selector.liledix4Presets.addEventListener('change', (e) => {
  const split = e.currentTarget.value.split('/');
  load(split[0], split[1]);
});
addPresets('liledix4');
addPresets('bvsgame', 'orgs');
addPresets('ddlcnh', 'orgs');
addPresets('lilfm', 'orgs');


async function doIt() {
  load(
    selector.username.value,
    selector.repository.value,
    selector.branch.value,
    selector.directory.value
  );
}
async function addPresets(username = 'liledix4', accType = 'users', pageNumber = 1) {
  readTextFile(
    {url: `https://api.github.com/${accType}/${username}/repos?per_page=100&page=` + pageNumber},
    result => {
      const data = JSON.parse(result);
      if (data.length > 0) {
        let optGroup = selector.liledix4Presets.querySelector(`optgroup[label='${username}']`);
        if (!optGroup) {
          selector.liledix4Presets.innerHTML += `<optgroup label='${username}'></optgroup>`;
          optGroup = selector.liledix4Presets.querySelector(`optgroup[label='${username}']`);
        }
        data.forEach(obj => {
          optGroup.innerHTML += `<option value='${username}/${obj.name}'>${obj.name}</option>`;
        });
        addPresets(username, accType, pageNumber + 1);
      }
    }
  );
}
function load(username, repository, branch = 'main', directory = '') {
  selector.result.innerText = 'Loading...';

  if (username === '' || repository === '') {
    notValid();
    return;
  }

  if (directory !== '')
    directory += '/';
  if (branch === '')
    branch = 'main';

  let url = `https://raw.githubusercontent.com/${username}/${repository}/refs/heads/${branch}/${directory}version`;
  if (selector.checkbox.cached.checked === true)
    url = `https://cdn.jsdelivr.net/gh/${username}/${repository}/${directory}version`;

  readTextFile(
    {url: url},
    result => {
      if (typeof result === 'string')
        selector.result.innerText = result;
      else if (typeof result === 'object')
        selector.result.innerText = result.response;
    }
  );
}
function notValid() {
  selector.result.innerText = 'Required data is missing!';
}