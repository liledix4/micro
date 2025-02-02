import { overflowShadows_result } from "./overflow_shadows.js";
import { selector } from "./selectors.js";
import { timeout } from "./timeouts.js";


export function zoom() {
  resultZoom(selector.zoom.value, true);
}
export function resultZoomReset() {
  resultZoom(100);
}
export function zoomMouseWheel(event) {
  const currValue = parseInt(selector.zoom.value);
  let step = 5;
  if (event.shiftKey === true)
    step = 1;
  if (event.wheelDelta > 0 && currValue <= 500 - step)
    resultZoom(currValue + step);
  else if (event.wheelDelta < 0 && currValue >= 1 + step)
    resultZoom(currValue - step);
}


function resultZoom(value, directInput) {
  clearTimeout(timeout.shadow);
  zoomColorIntensity(value);
  selector.result.style.fontSize = value / 100 + 'rem';
  selector.zoomNumber.innerText = value + '%';
  if (directInput !== true)
    selector.zoom.value = value;
  timeout.shadow = setTimeout(overflowShadows_result, 200);
}
function zoomColorIntensity(value) {
  const colorIntensity = value / 500 + .5;
  selector.zoom.style.accentColor = 'rgb(0,' + Number('0x94') * colorIntensity + ',' + Number('0x44') * colorIntensity + ')';
  selector.zoom.style.filter = `drop-shadow(0 0 ${colorIntensity * 10}px rgba(0, ${Number('0x94') * colorIntensity}, ${Number('0x44') * colorIntensity}, ${colorIntensity}))`;
}