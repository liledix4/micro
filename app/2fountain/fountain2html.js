import { getCharacterNameFromShortcut, textReplaceCharacterShortcuts } from "./character_list.js";
import { cookText } from "./text_fixes.js";


let unclosedCommentStatus = false;


export function oneLiners(str) {
  function transition(str2) {
    str2 += ':';
    return `<transition>${ fountainSyntax(/^>\s*/g, '>', str2.toUpperCase()).replace(/:+$/g,':') }</transition>`;
  }

  switch (true) {
    case /^\>/.test(str):
    case /\sto[:\s]*$/.test(str):
      return transition(str);
    case /^cut[:\s]*$/.test(str):
      return transition('CUT TO');
    case /^dis[:\s]*$/.test(str):
    case /^dissolve[:\s]*$/.test(str):
      return transition('DISSOLVE');
    case /^disin[:\s]*$/.test(str):
    case /^dissolve in[:\s]*$/.test(str):
      return transition('DISSOLVE IN');
    case /^disout[:\s]*$/.test(str):
    case /^dissolve out[:\s]*$/.test(str):
      return transition('DISSOLVE OUT');
    case /^fin[:\s]*$/.test(str):
    case /^fade in[:\s]*$/.test(str):
      return transition('FADE IN');
    case /^fout[:\s]*$/.test(str):
    case /^fade out[:\s]*$/.test(str):
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
        prefix = '<syntax>.</syntax>';
        prefixSpace = '';
      };
      result = prefix + prefixSpace + text;
    }
    return `<scene>${result.toUpperCase()}</scene>`;
  }
  else {
    return `<action>` + cookText( fountainSyntax(/^!\s*/g, '!', str) ) + '</action>';
  }
}


export function unclosedComment(status) {
  if (typeof status === 'boolean')
    unclosedCommentStatus = status;
  return unclosedCommentStatus;
}


export function mergeDialogue(rawArray) {
  if (rawArray.length === 2)
    return rawArray[1];

  let result;
  for (let i = 1; i < rawArray.length; i++) {
    result += rawArray[i];
  }
  return result;
}


export function dialogue(character, dialogue) {
  dialogue = dialogueChain(dialogue);
  character = properCharacter(character);
  return `<character-block><character>${character.toUpperCase()}</character><br><dialogue-block>${dialogue}</dialogue-block></character-block>`;
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