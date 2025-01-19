const input = document.getElementById('input');
const result = document.getElementById('result');


function doIt() {
    function parse(str) {
        str = str.toString();
        if (str.replace(',', '.').match(/^\s*[0-9\.\(]?[0-9\s\.\+\-\*\/\^\(\)%]*[0-9\s\.\)]$/)) {
            try {
                return eval(`"use strict"; (${str})`);
            }
            catch (error) {
                return 'Your expression has errors.';
            };
        }
        else if (str.match(/[^0-9\s\.\+\-\*\/\^\(\)%]/))
            return 'Forbidden symbols.';
        else if (str === '')
            return 0;
        else
            return '?';
    }
    result.innerText = parse(input.value);
}


input.addEventListener('input', doIt);
input.focus();
doIt();