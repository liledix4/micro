import { copyText } from "./copy_text.js";
import { overflowShadows_ALL, overflowShadows_result } from "./overflow_shadows.js";
import { plainText2Fountain } from "./plaintext2fountain.js";
import { selector } from "./selectors.js";
import { timeout } from "./timeouts.js";
import { resultZoomReset, zoom, zoomMouseWheel } from "./zoom.js";


export function setEvents() {
  window.addEventListener('resize', overflowShadows_ALL);
  selector.input.addEventListener('input', updateInputText);
  selector.input.addEventListener('mousedown', () => {
    selector.input.addEventListener('mousemove', updateShadowsOnInputResize);
  });
  selector.input.addEventListener('mouseup', () => {
    selector.input.removeEventListener('mousemove', updateShadowsOnInputResize);
  });
  selector.zoom.addEventListener('input', zoom);
  selector.zoomContainer.addEventListener('mousewheel', zoomMouseWheel);
  selector.zoomNumber.addEventListener('click', resultZoomReset);
  selector.buttonMobileSwitch.addEventListener('click', () => {
    const bodyClass = document.querySelector('body').classList;
    const toggleClass = 'mobile-preview';
    if (bodyClass.value.match(toggleClass))
      bodyClass.remove(toggleClass);
    else bodyClass.add(toggleClass);
    overflowShadows_ALL();
  });
  selector.buttonTxtCopy.addEventListener('click', () => {
    copyText(selector.input.value, selector.paneLeft);
  });
  selector.buttonTxtOpen.addEventListener('click', () => {
    alert('Doesn\'t work yet. Wait for updates!');
  });
  selector.buttonTxtSave.addEventListener('click', () => {
    alert('Doesn\'t work yet. Wait for updates!');
  });
  selector.buttonTxtShare.addEventListener('click', () => {
    navigator.share({
      text: selector.input.value
    });
  });
  selector.buttonPrint.addEventListener('click', () => {
    window.print();
  });
  selector.buttonFountainCopy.addEventListener('click', () => {
    copyText(selector.result.innerText, selector.paneRight);
  });
  selector.buttonFountainSave.addEventListener('click', () => {
    alert('Doesn\'t work yet. Wait for updates!');
  });
  selector.buttonFountainShare.addEventListener('click', () => {
    navigator.share({
      text: selector.result.innerText
    });
  });
}


function updateInputText() {
  clearTimeout(timeout.updateInputText);
  selector.result.classList.add('loading');
  timeout.updateInputText = setTimeout(plainText2Fountain, 500);
}
function updateShadowsOnInputResize() {
  clearTimeout(timeout.updateShadowsOnInputResize);
  timeout.updateShadowsOnInputResize = setTimeout(overflowShadows_result, 100);
}