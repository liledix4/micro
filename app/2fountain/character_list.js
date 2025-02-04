export const regexFeaturing = /^:[^:]*:? *$(\n^[^:()\s\n]+: *[^()\n]+$)+/m;
let characterShortcuts = [];


export function getListOfCharacters(rawText) {
  const rawFeaturing = rawText.match(regexFeaturing);
  if (rawFeaturing) {
    const rawArray = rawFeaturing[0].split(/\n/);
    rawArray.forEach(rawCharacter => {
      if (!rawCharacter.match(/:[^:]*:/)) {
        const rawCharacterArray = rawCharacter.split(/:\s*/);
        characterShortcuts.push({
          shortcut: rawCharacterArray[0].toLowerCase(),
          name: rawCharacterArray[1],
          nameIndexed: rawCharacterArray[1].toLowerCase(),
        });
      }
    });
  }
}


export function textReplaceCharacterShortcuts(str, toCase) {
  const shortcuts = str.match(/@[^@\s\n,'’"“()”\-\?!\.]+/gi);
  if (!shortcuts)
    return str;
  shortcuts.forEach(sc => {
    let charName = getCharacterNameFromShortcut(sc.replace('@',''));
    if (toCase === 'upper')
      charName = charName.toUpperCase();
    else if (toCase === 'lower')
      charName = charName.toLowerCase();
    str = str.replaceAll(sc, charName);
  });
  return str;
}


export function getCharacterNameFromShortcut(character) {
  const characterObject = characterShortcuts.filter(obj => obj.shortcut === character.toLowerCase());
  if (characterShortcuts !== undefined)
    if (characterObject && characterObject[0])
      return characterObject[0].name;
  else return character;
}