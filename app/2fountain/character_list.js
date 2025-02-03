export const regexFeaturing = /^:[^:]*:? *$(\n^[^:()\s\n]+: *[^()\n]+$)+/m;
let characterShortcuts = {};


export function getListOfCharacters(rawText) {
  let result;
  const rawFeaturing = rawText.match(regexFeaturing);
  if (rawFeaturing) {
    result = {};
    const rawArray = rawFeaturing[0].toLowerCase().split(/\n/);
    rawArray.forEach(rawCharacter => {
      if (!rawCharacter.match(/:[^:]*:/)) {
        const rawCharacterArray = rawCharacter.split(/:\s*/);
        result[rawCharacterArray[0]] = rawCharacterArray[1];
      }
    });
  }
  characterShortcuts = result;
}


export function textReplaceCharacterShortcuts(str) {
  const shortcuts = str.match(/@[^@\s\n'’"“()”\-\?!\.]+/gi);
  if (!shortcuts)
    return str;
  shortcuts.forEach(sc => {
    str = str.replaceAll(
      sc,
      getCharacterNameFromShortcut(
        sc.replace('@','')
      ).toUpperCase()
    );
  });
  return str;
}


export function getCharacterNameFromShortcut(character) {
  character = character.toLowerCase();
  if (characterShortcuts !== undefined && characterShortcuts[character]) {
    return characterShortcuts[character];
  }
  else return character;
}