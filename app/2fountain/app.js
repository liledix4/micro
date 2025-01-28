let globTimeout = {};
const selector = {
  buttonFountainCopy: document.getElementById('copy-fountain'),
  buttonFountainSave: document.getElementById('save-fountain'),
  buttonFountainShare: document.getElementById('share-fountain'),
  buttonMobileSwitch: document.getElementById('mobile-switch'),
  buttonPrint: document.getElementById('print'),
  buttonTxtCopy: document.getElementById('copy-txt'),
  buttonTxtOpen: document.getElementById('open-txt'),
  buttonTxtSave: document.getElementById('save-txt'),
  buttonTxtShare: document.getElementById('share-txt'),
  input: document.getElementById('input'),
  result: document.getElementById('result'),
  resultShadowBottom: document.querySelector('.result-container .overflow-shadow.bottom'),
  resultShadowTop: document.querySelector('.result-container .overflow-shadow.top'),
  zoom: document.getElementById('zoom'),
  zoomContainer: document.getElementById('zoom-container'),
  zoomNumber: document.getElementById('zoom-number'),
};
const regexFeaturing = /^FEATURING: *$(\n^[0-9A-Za-z\?\.\-]+: *[0-9A-Za-z@#\?\.\- ]+$)+/m;


// 2DO Boneyard - https://fountain.io/syntax/#boneyard
// 2DO Centered Text - https://fountain.io/syntax/#centered-text
// 2DO Dual Dialogue - https://fountain.io/syntax/#dual-dialogue
// 2DO Emphasis - https://fountain.io/syntax/#emphasis
// 2DO Line Breaks (pay attention) - https://fountain.io/syntax/#line-breaks
// 2DO Lyrics - https://fountain.io/syntax/#lyrics
// 2DO Page Breaks - https://fountain.io/syntax/#page-breaks
// 2DO Scene Numbers - https://fountain.io/syntax/#scene-headings
// 2DO Sections and Synopses - https://fountain.io/syntax/#sections-synopses
// 2DO Title Page - https://fountain.io/syntax/#title-page

// 2DO Cyrillic support
// 2DO Export as TXT and FOUNTAIN
// 2DO GET requests
// 2DO Headers and footers
// 2DO Import text files
// 2DO Printing

// 2DO Create a standalone module/library for converting plain text into JSON-compatible object
// 2DO Input timeout


let globCharacterShortcuts = {};
let globScreenplayArray = [];
let globUnclosedComment = false;


if (localStorage['2fountain_rawtext'])
  selector.input.value = localStorage['2fountain_rawtext'];
if (selector.input.value !== '')
  doIt();
resultZoomReset();
setEvents();
setPlaceholder();
overflowShadows_ALL();


function doIt() {
  selector.result.innerText = '';
  let result = '';
  const rawText = selector.input.value;
  localStorage.setItem('2fountain_rawtext', rawText);

  getListOfCharacters(rawText);
  const rawTextWithoutFeaturing = rawText.replace(regexFeaturing, '');

  const rawTextArray = rawTextWithoutFeaturing.split(/\n/);

  function newLines(num) {
    if (result !== '') result += '<br>'.repeat(num);
  }

  rawTextArray.forEach(rawLine => {
    rawLine = findComments(rawLine.replace(/^\s+|\s+$/g,''));
    if (!rawLine.match(/^\s*$/)) { // Skip empty lines
      const characterShortcutSplit = rawLine.split(/(?<=^[0-9A-Za-z\s\(\)\?\.\-]+):\s*/);
      if (characterShortcutSplit.length === 1) {
        newLines(2);
        result += oneLiners(characterShortcutSplit[0]);
      }
      else if (characterShortcutSplit.length > 0) {
        let dialogueString = mergeDialogue(characterShortcutSplit);
        newLines(2);
        result += dialogue( characterShortcutSplit[0], cookText(dialogueString) );
      }
    }
  });

  selector.result.innerHTML = result;
}


function oneLiners(str) {
  function transition(str2) {
    return `<transition>${str2.toUpperCase()}:</transition>`;
  }
  str = textReplaceCharacterShortcuts(str);

  switch (true) {
    case /^\>/.test(str):
    case /\sto$/.test(str):
      return transition(str);
    case /^cut$/.test(str):
      return transition('CUT TO');
    case /^dis$/.test(str):
    case /^dissolve$/.test(str):
      return transition('DISSOLVE');
    case /^disin$/.test(str):
    case /^dissolve in$/.test(str):
      return transition('DISSOLVE IN');
    case /^disout$/.test(str):
    case /^dissolve out$/.test(str):
      return transition('DISSOLVE OUT');
    case /^fin$/.test(str):
    case /^fade in$/.test(str):
      return transition('FADE IN');
    case /^fout$/.test(str):
    case /^fade out$/.test(str):
      return transition('FADE OUT');
  }

  if (str.match(/^(int|ext|est|int\/ext|i\/e)?\.(?!\.)/i)) {
    let result = str;
    let split = str.split(/(?<=^(?:int|ext|est|int\/ext|i\/e)?\.)\s*/i);
    if (split[1]) {
      let prefixSpace = ' ';
      let prefix = split[0];
      const text = cookText(split[1]);
      if (prefix === '.') {
        prefix = '';
        prefixSpace = '';
      };
      result = prefix + prefixSpace + text;
    }
    return `<scene>${result.toUpperCase()}</scene>`;
  }
  else {
    return `<action>` + cookText(str) + '</action>';
  }
}
function findComments(str) {
  const matchOpening = str.match(/\[{2}/g);
  if (globUnclosedComment === true)
    str = '<note>' + str;
  if (matchOpening || globUnclosedComment === true) {
    const matchClosing = str.match(/\]{2}/g);
    console.log(str, matchClosing);
    if (globUnclosedComment === false)
      str = str.replace(/\[{2}/g, '<note>[[');
    if (matchClosing) {
      str = str.replace(/\]{2}/g, ']]</note>');
      globUnclosedComment = false;
    }
    else {
      str += '</note>';
      globUnclosedComment = true;
    }
  }
  return str;
}
function textReplaceCharacterShortcuts(str) {
  const characterShortcuts = str.match(/@[a-z0-9\?\.\-]+/gi);
  if (!characterShortcuts) return str;
  characterShortcuts.forEach(shortcut => {
    str = str.replaceAll(
      shortcut,
      getCharacterNameFromShortcut(
        shortcut.replace('@','')
      ).toUpperCase()
    );
  });
  return str;
}
function mergeDialogue(rawArray) {
  if (rawArray.length === 2)
    return rawArray[1] + '<br>';
  let result;
  for (let i = 1; i < rawArray.length; i++) {
    result += rawArray[i];
  }
  return result + '<br>';
}
function dialogue(character, dialogue) {
  dialogue = dialogueChain(dialogue);
  character = properCharacter(character);
  return `<character>${character.toUpperCase()}</character><br><dialogue-block>${dialogue}</dialogue-block>`;
}
function properCharacter(rawCharacter) {
  let result = '';
  const splitByBrackets = rawCharacter.split(/\s*(?=\()/g);

  if (splitByBrackets.length > 1) {
    let i = 0;
    splitByBrackets.forEach(str => {
      if (i !== 0) result += ' ';
      if (i === 0)
        result += getCharacterNameFromShortcut(str);
      else {
        switch (true) {
          case /\((c|cont|contd)\)/i.test(str):
            result += '(CONT’D)'; break;
          case /\(oc\)/i.test(str):
            result += '(O.C.)'; break;
          case /\(os\)/i.test(str):
            result += '(O.S.)'; break;
          case /\(vo\)/i.test(str):
            result += '(V.O.)'; break;
          default: result += str; break;
        }
      }
      i++;
    });
  }
  else result = getCharacterNameFromShortcut(rawCharacter);

  if (result.match(/^[^\w]/))
    result = '@' + result;

  return result;
}
function getCharacterNameFromShortcut(character) {
  character = character.toLowerCase();
  if (globCharacterShortcuts !== undefined && globCharacterShortcuts[character]) {
    return globCharacterShortcuts[character];
  }
  else return character;
}
function dialogueChain(initDialogue) {
  let dialogueArray = initDialogue.split(/\s*(?=\()|(?<=\))\s*/);
  let result = '';
  dialogueArray.forEach(str => {
    str = textReplaceCharacterShortcuts(str);
    if (result !== '')
      result += '<br>';
    if (str.startsWith('('))
      result += `<parenthetical>${str}</parenthetical>`;
    else result += `<dialogue>${str}</dialogue>`;
  });
  return result;
}


function getListOfCharacters(rawText) {
  let result;
  const rawFeaturing = rawText.match(regexFeaturing);
  if (rawFeaturing) {
    result = {};
    const rawArray = rawFeaturing[0].toLowerCase().split(/\n/);
    rawArray.forEach(rawCharacter => {
      if (rawCharacter !== 'FEATURING:') {
        const rawCharacterArray = rawCharacter.split(/:\s*/);
        result[rawCharacterArray[0]] = rawCharacterArray[1];
      }
    });
  }
  globCharacterShortcuts = result;
}


function cookText(str) {
  return fixQuotes(
    fixApostrophes(
      extendSentenceSpaces(
        str
      )
    )
  );
}
function fixQuotes(str) {
  let result = '';
  const strArray = str.split('"');
  if (strArray.length > 1) {
    for (let i = 0; i < strArray.length; i++) {
      result += strArray[i];
      if (i < strArray.length - 1) {
        if (i % 2 === 0) result += '“';
        else result += '”';
      }
    }
  }
  else result = strArray[0];
  return result;
}
function fixApostrophes(str) {
  return str.replace(/'/g, '’');
}
function extendSentenceSpaces(str) {
  return str.replace(/(?<=[!"\.\?]+) *(?=[A-Z0-9"])/g, '  ');
}


function overflowShadows_ALL() {
  overflowShadows_result();
}
function overflowShadows_result() {
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
function resultZoom(value, directInput) {
  clearTimeout(globTimeout.shadow);
  zoomColorIntensity(value);
  selector.result.style.fontSize = value / 100 + 'rem';
  selector.zoomNumber.innerText = value + '%';
  if (directInput !== true)
    selector.zoom.value = value;
  globTimeout.shadow = setTimeout(overflowShadows_result, 200);
}
function zoomColorIntensity(value) {
  const colorIntensity = value / 500 + .5;
  selector.zoom.style.accentColor = 'rgb(0,' + Number('0x94') * colorIntensity + ',' + Number('0x44') * colorIntensity + ')';
  selector.zoom.style.filter = `drop-shadow(0 0 ${colorIntensity * 10}px rgba(0, ${Number('0x94') * colorIntensity}, ${Number('0x44') * colorIntensity}, ${colorIntensity}))`;
}
function zoom() {
  resultZoom(selector.zoom.value, true);
}
function zoomMouseWheel(event) {
  const currValue = parseInt(selector.zoom.value);
  let step = 5;
  if (event.shiftKey === true)
    step = 1;
  if (event.wheelDelta > 0 && currValue <= 500 - step)
    resultZoom(currValue + step);
  else if (event.wheelDelta < 0 && currValue >= 1 + step)
    resultZoom(currValue - step);
}
function resultZoomReset() {
  resultZoom(100);
}


function setPlaceholder() {
  selector.input.setAttribute('placeholder', 'FEATURING:\nC1: CHARACTER #1\nC2: CHARACTER #2\n\nC1: Hi!\nC2: Ayo, what\'s up?\n\n@C1 takes time to think.\n\nC1: (with excitement) A ceiling!');
}
function setEvents() {
  window.addEventListener('resize', overflowShadows_ALL);
  selector.input.addEventListener('input', doIt);
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
    alert('Doesn\'t work yet. Wait for updates!');
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
    alert('Doesn\'t work yet. Wait for updates!');
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