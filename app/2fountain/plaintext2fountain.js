import { getListOfCharacters, regexFeaturing } from "./character_list.js";
import { dialogue, findComments, oneLiners, unclosedComment } from "./fountain2html.js";
import { saveToLocalStorage } from "./local_storage.js";
import { selector } from "./selectors.js";
import { cookText } from "./text_fixes.js";


export function plainText2Fountain() {
  unclosedComment(false);
  selector.result.innerText = '';
  selector.result.classList.remove('loading');

  let result = '';
  const rawText = selector.input.value;
  saveToLocalStorage(rawText);
  getListOfCharacters(rawText);
  const rawTextWithoutFeaturing = rawText.replace(regexFeaturing, '');

  const rawTextArray = rawTextWithoutFeaturing.split(/\n/);

  function newLines(num) {
    if (result !== '')
      result += '<br>'.repeat(num);
  }

  rawTextArray.forEach(rawLine => {
    rawLine = rawLine.replace(/^\s+|\s+$/g,'');
    if (!rawLine.match(/^\s*$/)) { // Skip empty lines
      rawLine = findComments(rawLine);
      if (rawLine.match(/^<note>/)) {
        newLines(2);
        result += cookText(rawLine);
      }
      else {
        const characterShortcutSplit = rawLine.split(/(?<=^(?!\!)[^:\\]+):\s*(?=[^\s\n])/);
        if (characterShortcutSplit.length === 1) {
          newLines(2);
          result += oneLiners(characterShortcutSplit[0]);
        }
        else if (characterShortcutSplit.length > 0) {
          let dialogueString = mergeDialogue(characterShortcutSplit);
          newLines(2);
          if (dialogueString.match(/^<note>/))
            result += cookText('@' + characterShortcutSplit[0] + ': ' + dialogueString);
          else
            result += dialogue( characterShortcutSplit[0], dialogueString );
        }
      }
    }
  });

  selector.result.innerHTML = result;
}


function mergeDialogue(rawArray) {
  if (rawArray.length === 2)
    return rawArray[1];

  let result;
  for (let i = 1; i < rawArray.length; i++) {
    result += rawArray[i];
  }
  return result;
}