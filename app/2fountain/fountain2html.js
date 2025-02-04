import { imp } from './import.js';
let imported = {};
await imp(imported, './text_fixes.js', ['cookText']);
await imp(imported, './character_list.js', ['getCharacterNameFromShortcut']);


export let screenplayArray = [];
let unclosedCommentStatus = false;


export function plainText2FountainArray(plainText) {
  // 2DO
}


export function fountainHTML() {
  // 2DO
}


export function oneLiners(str) {
  let result;

  if (result === undefined)
    result = scene(str);
  if (result === undefined)
    result = section(str);
  if (result === undefined)
    result = synopsis(str);
  if (result === undefined)
    result = centered(str);
  if (result === undefined)
    result = transition(str);
  if (result === undefined)
    result = lyrics(str);
  if (result === undefined)
    result = pageBreak(str);
  if (result === undefined)
    result = action(str);

  return result;
}


function section(str) {
  if (str.match(/^ *#+/)) {
    const hashes = str.match(/(?<=^ *)#+/)[0];
    const sectionLevel = hashes.length;
    const text = str.match(/^ *#+ *(.*)/)[1];
    addToScreenplayArray('section', text, {level: sectionLevel});
    return `<fsection level='${sectionLevel}'>` + `<syntax>${hashes}</syntax>` + imported.cookText( fountainSyntax(/^ *~/g, '~', text), 'upper' ) + '</fsection>';
  }
}


function synopsis(str) {
  if (str.match(/^ *=+[^=]+/)) {
    const text = imported.cookText( fountainSyntax(/^ *=+/g, '=', str), 'upper' );
    addToScreenplayArray('synopsis', text);
    return `<synopsis>${text}</synopsis>`;
  }
}


function pageBreak(str) {
  if (str.match(/^ *={3,} *$/)) {
    addToScreenplayArray('page_break');
    return '<pagebreak><syntax>===</syntax></pagebreak>';
  }
}


function centered(str) {
  if (str.match(/^ *>.*< *$/)) {
    const text = imported.cookText(
        fountainSyntax(/^ *>/g, '>',
          fountainSyntax(/< *$/g, '<', str)
        ),
        'upper'
      );
    addToScreenplayArray('centered', text);
    return `<centered>${text}</centered>`;
  }
}


function lyrics(str) {
  if (str.match(/^ *~/)) {
    const text = imported.cookText( fountainSyntax(/^ *~/g, '~', str), 'upper' );
    addToScreenplayArray('lyrics', text);
    return `<lyrics>${text}</lyrics>`;
  }
}


function transition(str) {
  function cookTransition(str2) {
    str2 += ':';
    const text = fountainSyntax(/^>\s*/g, '>', str2.toUpperCase()).replace(/:+$/g,':');
    addToScreenplayArray('transition', text);
    return `<transition>${text}</transition>`;
  }

  switch (true) {
    case /^\>/.test(str):
    case /\sto[:\s]*$/.test(str):
      return cookTransition(str);
    case /^cut[:\s]*$/.test(str):
      return cookTransition('CUT TO');
    case /^dis[:\s]*$/.test(str):
    case /^dissolve[:\s]*$/.test(str):
      return cookTransition('DISSOLVE');
    case /^disin[:\s]*$/.test(str):
    case /^dissolve in[:\s]*$/.test(str):
      return cookTransition('DISSOLVE IN');
    case /^disout[:\s]*$/.test(str):
    case /^dissolve out[:\s]*$/.test(str):
      return cookTransition('DISSOLVE OUT');
    case /^fin[:\s]*$/.test(str):
    case /^fade in[:\s]*$/.test(str):
      return cookTransition('FADE IN');
    case /^fout[:\s]*$/.test(str):
    case /^fade out[:\s]*$/.test(str):
      return cookTransition('FADE OUT');
  }
}


function scene(str) {
  if (str.match(/^(int|ext|est|int\/ext|i\/e)?\.(?!\.)/i)) {
    let result = str;
    let split = str.split(/(?<=^(?:int|ext|est|int\/ext|i\/e)?\.)\s*/i);
    if (split[1]) {
      let prefixSpace = ' ';
      let prefix = split[0].toUpperCase();
      const text = imported.cookText(split[1]);
      if (prefix === '.') {
        prefix = '<syntax>.</syntax>';
        prefixSpace = '';
      };
      result = prefix + prefixSpace + text;
    }
    addToScreenplayArray('scene', result);
    return `<scene>${result.toUpperCase()}</scene>`;
  }
}


function action(str) {
  const text = imported.cookText( fountainSyntax(/^!\s*/g, '!', str), 'upper' );
  addToScreenplayArray('action', text);
  return `<action>${text}</action>`;
}


export function unclosedComment(status) {
  if (typeof status === 'boolean')
    unclosedCommentStatus = status;
  return unclosedCommentStatus;
}


export function dialogue(character, dialogueString) {
  character = properCharacter(character);
  addToScreenplayArray('character', character);
  dialogueString = dialogueBlock(dialogueString);
  return `<character-block><character>${character}</character><br><dialogue-block>${dialogueString}</dialogue-block></character-block>`;
}


export function findComments(str) {
  const matchOpening = str.match(/\[{2}/g);
  if (unclosedComment() === true)
    str = '<note>' + str;
  if (matchOpening || unclosedComment() === true) {
    const matchClosing = str.match(/\]{2}/g);
    if (unclosedComment() === false)
      str = str.replace(/\[{2}/g, '<note><syntax>[[</syntax>');
    if (matchClosing) {
      str = str.replace(/\]{2}/g, '<syntax>]]</syntax></note>');
      unclosedComment(false);
    }
    else {
      str += '</note>';
      unclosedComment(true);
    }
  }
  return str;
}


function dialogueBlock(initDialogue) {
  const dialogueArray = initDialogue.split(/\s*(?=\()|(?<=\))\s*/);
  let result = '';
  dialogueArray.forEach(str => {
    if (result !== '')
      result += '<br>';
    if (str.startsWith('(')) {
      const text = imported.cookText(str, 'upper');
      addToScreenplayArray('parenthetical', text);
      result += `<parenthetical>${text}</parenthetical>`;
    }
    else {
      const text = imported.cookText(str);
      addToScreenplayArray('dialogue', text);
      result += `<dialogue>${text}</dialogue>`;
    }
  });
  return result;
}


function properCharacter(rawCharacter) {
  let result = '';

  rawCharacter
    .split(/\s*(?=\()/g)
    .forEach(str => {
      str = str.replace(/\s+$/, '');
      if (result === '')
        result += imported.getCharacterNameFromShortcut(str).toUpperCase();
      else {
        result += ' ';
        if (!str.endsWith(')'))
          str = str + ')';
        switch (true) {
          case /\((c|cont|contd)\)/i.test(str):
            result += '(CONT’D)'; break;
          case /\(oc\)/i.test(str):
            result += '(O.C.)'; break;
          case /\(os\)/i.test(str):
            result += '(O.S.)'; break;
          case /\(vo\)/i.test(str):
            result += '(V.O.)'; break;
          default:
            result += str; break;
        }
      }
    });

  if (result.match(/^[^\w]/))
    result = '<syntax>@</syntax>' + result;

  return result;
}


export function fountainSyntax(criteria, replaceTo, srcString) {
  const rejectCondition1 = criteria === undefined;
  const rejectCondition2 = criteria.constructor.name !== 'String' && criteria.constructor.name !== 'RegExp';
  const rejectCondition3 = replaceTo !== undefined && replaceTo.constructor.name !== 'String';
  const rejectConditions = rejectCondition1 || rejectCondition2 || rejectCondition3;

  if (rejectConditions)
    return srcString;

  if (replaceTo === undefined || replaceTo.constructor.name !== 'String')
    replaceTo = criteria;

  return srcString.replaceAll(criteria, `<syntax>${replaceTo}</syntax>`);
}


export async function resetScreenplayArray() {
  screenplayArray = [];
}
async function addToScreenplayArray(type, content, more) {
  let object = {type: type};
  if (content)
    object.content = content;
  if (more && more.constructor.name === 'Object')
    Object.assign(object, more);
  screenplayArray.push(object);
  return object;
}