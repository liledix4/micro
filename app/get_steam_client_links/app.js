const conf_loadLinks = 30;
const conf_loadPauses = 0;
const conf_scrollPause = 100;
const conf_scrollPixelTrigger = 400;
const sel_input = document.getElementById('input');
const sel_result = document.getElementById('result');
const sel_status = document.getElementById('status');

let glob_i = 0;
let glob_timeout;
let glob_timeout_scroll;
let glob_values = [];

doIt();
setEvents();

function addLinks() {
    if (glob_values && glob_values.length > 0) {
        if (glob_i < glob_values.length) {
            if (validateScroll() === 'load') {
                let addHTML = '';
                for (let i = 0; i < conf_loadLinks; i++) {
                    if (glob_values[glob_i]) {
                        const currURL = glob_values[glob_i].replace('http://','https://'); // Fixes HTTP to HTTPS
                        const matchApp = currURL.match(/^https:\/\/store\.steampowered\.com\/app\/\d+(\/[0-9A-Za-z_]*)?/);
                        if (matchApp) {
                            const currURLStripped = matchApp[0];
                            const appID = currURLStripped.match(/^https:\/\/store\.steampowered\.com\/app\/(\d+)/)[1];
                            let linkText = currURLStripped.replace(/https:\/\/store\.steampowered\.com\/app\/\d+\/?/,'').replaceAll('_',' ');
                            if (linkText === '')
                                linkText = '<i>(no title)</i>';
                            else if (linkText.match(/^[^0-9A-Za-z]*$/))
                                linkText = '<i>(no title? or proper title contains logographs?)</i>';
                            addHTML += `<a href='steam://openurl/${currURLStripped}'><div>ID ${appID} – ${linkText}</div></a>`;
                        }
                        else {
                            const linkText = currURL.replace(/https:\/\/store\.steampowered\.com\/?/,'');
                            addHTML += `<a href='steam://openurl/${currURL}'><div>Steam – ${linkText}</div></a>`;
                        }
                        glob_i++;
                    }
                }
                sel_result.innerHTML += addHTML;
                sel_status.innerHTML = `${glob_values.length} Steam URLs found, ${glob_i} URLs loaded. <i>Scroll down to load more.</i>`;
                glob_timeout = setTimeout(addLinks, conf_loadPauses);
            }
        }
        else {
            sel_status.innerText = `${glob_values.length} Steam URLs found, ALL of them are loaded.`;
            glob_values = [];
        }
    }
}

function validateScroll() {
    const clientHeight = sel_result.clientHeight; // Height of the scrollable element
    const scrollBottom = clientHeight + sel_result.scrollTop;
    const scrollHeight = sel_result.scrollHeight;
    let status;
    if (scrollHeight - scrollBottom <= conf_scrollPixelTrigger) // If you hit the bottom while scrolling, load!
        status = 'load';
    else if (clientHeight - scrollHeight >= conf_scrollPixelTrigger) // If there's too little scrolling space available, load!
        status = 'load';
    else status = 'stop';
    return status;
}
function scroll() {
    clearTimeout(glob_timeout_scroll);
    glob_timeout_scroll = setTimeout(() => {
        if (glob_values && glob_values.length > 0 && validateScroll() === 'load')
            addLinks();
    }, conf_scrollPause);
}

function doIt() {
    glob_i = 0;
    clearInterval(glob_timeout);
    glob_values = [];
    sel_result.innerHTML = '';
    sel_status.innerText = 'Paste text that contains Steam URLs.';

    const input = sel_input.value;

    if (input !== undefined && input !== null) {
        glob_values = input.match(/https?:\/\/store\.steampowered\.com[0-9A-Za-z_&#\/\?\-]*/g);
        if (glob_values) {
            sel_status.innerText = `${glob_values.length} Steam URLs found. Loading...`;
            addLinks();
        }
    }
}

function setEvents() {
    sel_input.addEventListener('input', doIt);
    sel_result.addEventListener('scroll', scroll);
    window.addEventListener('resize', scroll);
}