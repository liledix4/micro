import { readTextFile } from "../modules/js_xhr_ajax/xhr_ajax.js";
import { sortByMultipleCriterias } from "../modules/sort.js";


const selector = {
  appsList: document.querySelector('body > .sidebar > .apps-list'),
  appsListSearch: document.querySelector('body > .sidebar > .search'),
  appsListCompactCheckbox: document.querySelector('body > .sidebar input.compact'),
  app: document.querySelector('body > .app-body > .app'),
  appTitleBar: document.querySelector('body > .app-body > .title-bar'),
}
let timeout = {appSearch: undefined};
let clickOnAppListItemOpensNewWindow = false;


readTextFile({url: 'app/index.min.json'}, main);


function main(response) {
  let appsList = JSON.parse(response);
  appsList = appsList.sort((a, b) => {
    return sortByMultipleCriterias(a, b, ['id', 'title', 'description']);
  });
  appsList.forEach(app => {
    let id = '';
    let title = '';
    let description = '';

    if (app.id)
      id = ` open='${app.id}'`;
    if (app.title)
      title = `<div class='title'>${app.title}</div>`;
    if (app.description)
      description = `<div class='description'>${app.description}</div>`;

    selector.appsList.innerHTML += `<div class='item'${id}>${title}${description}</div>`;
  });
  setEvents();
  selector.appsListSearch.focus();
  openAppWithAnchorURL();
}
function setEvents() {
  document.addEventListener('keydown', keyToOpenAppInNewWindow);
  document.addEventListener('keyup', keyToOpenAppInNewWindow);
  selector.appsList.querySelectorAll('.item').forEach(appsListItem => {
    appsListItem.addEventListener('click', openAppOnListItemClick);
  });
  selector.appsListSearch.addEventListener('input', appSearch);
  selector.appsListCompactCheckbox.addEventListener('change', appsListCompactMode);
  selector.appTitleBar.addEventListener('click', () => {
    document.querySelector('body').classList.remove('app-focus');
  });
}
function keyToOpenAppInNewWindow(event) {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (event.type === 'keydown') clickOnAppListItemOpensNewWindow = true;
    else if (event.type === 'keyup') clickOnAppListItemOpensNewWindow = false;
  }
}
function openAppWithAnchorURL() {
  const hash = location.hash.replace(/^#/, '');
  if (hash !== '')
    openApp(hash);
}
function openAppOnListItemClick(event) {
  openApp(undefined, event.currentTarget);
}
function openApp(id, target) {
  if (id === undefined && target === undefined) return;
  if (target === undefined) target = document.querySelector(`*[open='${id}']`);
  if (id === undefined) id = target.getAttribute('open');
  const title = target.querySelector('.title').innerText;

  if (clickOnAppListItemOpensNewWindow) {
    window.open('app/' + id, title, 'height=600,width=400,menubar=no,location=no,toolbar=no,status=no');
    clickOnAppListItemOpensNewWindow = false;
    return;
  }

  const classActive = 'active';
  const classAppFocus = 'app-focus';

  document.querySelector('body').classList.add(classAppFocus);
  if (!target.classList.value.match(classActive)) {
    const previouslyActiveListItem = selector.appsList.querySelectorAll(`.item.${classActive}`);
    selector.app.src = `./app/${id}`;
    selector.appTitleBar.innerHTML = `<span class='hide-if-sidebar-is-opened'><span>liledix4 Micro</span> ➜ </span><span class='focus'>${title}</span>`;
    if (previouslyActiveListItem)
      previouslyActiveListItem.forEach(i => {
        i.classList.remove(classActive);
      });
    target.classList.add(classActive);
    changePageTitle(title);
    location.hash = id;
  }
}
function changePageTitle(text) {
  let result = '';
  if (text !== undefined) result += text + ' ︱ ';
  result += 'liledix4 Micro';
  document.title = result;
}
function appSearch(event) {
  const input = event.currentTarget.value.toUpperCase();
  const attrItemID = 'open';
  const classForHiding = 'search-hide';
  const classItem = 'item';
  const classListLoading = 'search-loading';

  selector.appsList.classList.add(classListLoading);
  clearTimeout(timeout.appSearch);
  timeout.appSearch = setTimeout(() => {
    selector.appsList.querySelectorAll('.' + classItem).forEach(item => {
      const text = item.innerText.toUpperCase();
      const id = item.getAttribute(attrItemID).toUpperCase();
      if (text.match(input) || id.match(input))
        item.classList.remove(classForHiding);
      else
        item.classList.add(classForHiding);
    });
    selector.appsList.classList.remove(classListLoading);
  }, 500);
}
function appsListCompactMode(event) {
  const checkbox = event.currentTarget.checked;
  const classToToggle = 'compact-mode';
  if (checkbox === true)
    selector.appsList.classList.add(classToToggle);
  else
    selector.appsList.classList.remove(classToToggle);
}