const input = document.getElementById('input');
const result = document.getElementById('result');


function doIt() {
    function parse(str) {
        str = str.toString()
            .replaceAll(/[^0-9\s\.\+\-\*\/\^()%]/g,'')
            .replace(',', '.')
            .replace(/^[^0-9\.(]+|[^0-9\.)]+$/,'');
        if (str === '')
            return 0;
        else if (str.match(/^[0-9\s\.\+\-\*\/\^()%]*$/)) {
            try {
                return eval(`"use strict"; (${str})`);
            }
            catch (error) {
                console.error(error);
                return 'Your expression has errors.';
            };
        }
        else
            return '?';
    }
    result.innerText = parse(input.value);
}


input.addEventListener('input', doIt);
input.focus();
doIt();