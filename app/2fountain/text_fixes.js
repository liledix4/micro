import { textReplaceCharacterShortcuts } from "./character_list.js";


export function cookText(str, characterToCase = false) {
  return fixQuotes(
    removeEscapeBackslashes(
    fixApostrophes(
    extendSentenceSpaces(
    fixEllipses(
    textReplaceCharacterShortcuts(
      str, characterToCase
  ))))));
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
  return str.replace(/(?<!(?<=[^\\])\\)'/g, '’');
}


function removeEscapeBackslashes(str) {
  return str.replace(/(?<!\\)\\/g, '');
}


function fixEllipses(str) {
  return str.replace(/(?<!(?<=[^\\])\\)…/g, '...');
}


function extendSentenceSpaces(str) {
  return str.replace(/(?<=\w+[!"\.\?]+) *(?=[A-Z0-9А-Я’'"“])/g, '  ');
}