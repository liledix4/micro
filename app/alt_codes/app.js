import { altCodes } from "../../gears/modules/altcodes/alt_codes.js";
import { inputLimit } from "../../gears/modules/js_input_limit/input_limit.js";

var selector = {
  symbol: document.getElementById('symbol'),
  altCode: document.getElementById('altcode'),
};

selector.altCode.oninput = function (event) {
  inputLimit(event, /^[0-9]*$/);
  var value = selector.altCode.value;
  if (value.length > 0 && altCodes[value]) {
    selector.symbol.value = altCodes[value];
  }
  else {
    selector.symbol.value = '';
  }
};

selector.symbol.oninput = function (event) {
  if (!event.data || selector.symbol.value.length === 0) {
    selector.altCode.value = '';
    selector.symbol.value = '';
    return;
  }

  var char = event.data.substr(0, 1);
  selector.symbol.value = char;
  var altCode = Object.keys(altCodes).find(key => altCodes[key] === char);
  if (altCode !== undefined) {
    selector.altCode.value = altCode;
  }
  else {
    selector.altCode.value = '';
  }
};