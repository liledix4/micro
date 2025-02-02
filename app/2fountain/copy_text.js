import { copyFromSpecificSelectedElement } from "../../gears/modules/js_clipboard/clipboard.min.js";


export function copyText(copyFullTextFrom, expectedSelectedElement) {
  copyFromSpecificSelectedElement(
    copyFullTextFrom,
    expectedSelectedElement,
    () => {alert('✅ Copied full text!')},
    () => {alert('✅ Copied highlighted part of text!\n\nHint: to copy full text, don\'t highlight any part of it.')}
  );
}