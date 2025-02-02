import { selector } from "./selectors.js";


export function overflowShadows_ALL() {
  overflowShadows_result();
}
export function overflowShadows_result() {
  fixOverflowShadowPosition(
    selector.result,
    selector.resultShadowTop,
    selector.resultShadowBottom
  );
}
function fixOverflowShadowPosition(elementContent, shadowTop, shadowBottom) {
  const width = elementContent.clientWidth;
  const bottom = elementContent.offsetHeight - elementContent.clientHeight;
  shadowTop.style.width = width + 'px';
  shadowBottom.style.width = width + 'px';
  shadowBottom.style.bottom = bottom + 'px';
}