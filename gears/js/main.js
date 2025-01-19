import { sortByMultipleCriterias } from "../modules/sort.js";


let appsList = [
    {
        id: 'make_color_transparent',
        title: 'Make Color Transparent',
        description: 'Load the image and see white color disappearing! (nothing is uploaded anywhere)<hr>Testing!!',
    },
    {
        id: 'music_text',
        title: 'Music Text',
        description: 'Magically turn text into music! (if you figure out how it works ;)',
    },
    {
        id: 'quick_calc',
        title: 'Quick Calculator',
        description: 'Slightly faster than your average calc.',
    },
    {
        id: 'time_hex',
        title: 'Time Hex',
        description: 'Get the list of ordered hex values of months between two dates.',
    },
];
const selector = {
    appsList: document.querySelector('body > .sidebar > .apps-list'),
    appsListSearch: document.querySelector('body > .sidebar > .search'),
    appsListCompactCheckbox: document.querySelector('body > .sidebar input.compact'),
    app: document.querySelector('body > .app-body > .app'),
    appTitleBar: document.querySelector('body > .app-body > .title-bar'),
}
let timeout = {appSearch: undefined};


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


function openApp(event) {
    const target = event.currentTarget;
    const classActive = 'active';
    const classAppFocus = 'app-focus';
    document.querySelector('body').classList.add(classAppFocus);
    if (!target.classList.value.match(classActive)) {
        const id = target.getAttribute('open');
        const title = target.querySelector('.title').innerText;
        const previouslyActiveListItem = selector.appsList.querySelectorAll(`.item.${classActive}`);
        selector.app.src = `./app/${id}`;
        selector.appTitleBar.innerHTML = `<span class='hide-if-sidebar-is-opened'><span>liledix4 Micro</span> -> </span><span class='focus'>${title}</span>`;
        if (previouslyActiveListItem)
            previouslyActiveListItem.forEach(i => {
                i.classList.remove(classActive);
            });
        target.classList.add(classActive);
    }
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


selector.appsList.querySelectorAll('.item').forEach(appsListItem => {
    appsListItem.addEventListener('click', openApp);
});
selector.appsListSearch.addEventListener('input', appSearch);
selector.appsListCompactCheckbox.addEventListener('change', appsListCompactMode);
selector.appTitleBar.addEventListener('click', () => {
    document.querySelector('body').classList.remove('app-focus');
});