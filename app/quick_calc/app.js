const input = document.getElementById('input');
const result = document.getElementById('result');
const sel_message = document.getElementById('message');


input.addEventListener('input', doIt);
input.focus();
doIt();


function doIt() {
    result.innerText = mathParse(input.value);
}
function mathParse(str) {
    str = str.toString()
        .replaceAll(/[^0-9\s\.\+\-\*\/\^()%]/g,'')
        .replace(',', '.')
        .replace(/^[^0-9\.(]+|[^0-9\.)]+$/,'');
    if (str === '') {
        message();
        return 0;
    }
    else if (str.match(/^[0-9\s\.\+\-\*\/\^()%]*$/)) {
        try {
            const calc = eval(`"use strict"; (${str})`);
            if (calc === Infinity) {
                message('Infinity\nOR\nNumber bigger than ' + Number.MAX_VALUE + '\nOR\nNumber smaller than ' + Number.MIN_VALUE);
                return '∞';
            }
            else {
                message();
                return calc;
            }
        }
        catch (error) {
            console.error(error);
            message('Your expression has errors.');
            return '?';
        };
    }
    else {
        message();
        return '?';
    }
}
function message(text) {
    const classShow = 'show';
    if (text !== undefined) {
        sel_message.classList.add(classShow);
        sel_message.innerText = text;
    }
    else {
        sel_message.classList.remove(classShow);
        sel_message.innerText = '';
    }
}