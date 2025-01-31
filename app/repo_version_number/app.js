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


localStorageLoad();
if (localStorage['Micro_RepoVersionNumber'])
  doIt();
selector.button.check.addEventListener('click', doIt);
selector.checkbox.cached.addEventListener('change', doIt);
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

  localStorageSave(username, repository, branch, directory, selector.checkbox.cached.checked);

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
function localStorageSave(username, repository, branch, directory, cached) {
  if (username === undefined)
    username = selector.username.value;
  if (repository === undefined)
    repository = selector.repository.value;
  if (branch === undefined)
    branch = selector.branch.value;
  if (directory === undefined)
    directory = selector.directory.value;
  if (cached === undefined)
    cached = selector.checkbox.cached.checked;

  localStorage.setItem('Micro_RepoVersionNumber', JSON.stringify({
    username: username,
    repository: repository,
    branch: branch,
    directory: directory,
    cached: cached,
  }));
}
function localStorageLoad() {
  if (!localStorage['Micro_RepoVersionNumber']) return;

  const data = JSON.parse( localStorage['Micro_RepoVersionNumber'] );

  if (data.username)
    selector.username.value = data.username;
  if (data.repository)
    selector.repository.value = data.repository;
  if (data.branch)
    selector.branch.value = data.branch;
  if (data.directory)
    selector.directory.value = data.directory;
  if (data.cached === true)
    selector.checkbox.cached.checked = true;
  else selector.checkbox.cached.checked = false;
}