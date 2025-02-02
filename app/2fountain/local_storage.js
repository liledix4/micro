const localStorageItemName = '2fountain_rawtext';


export function localStorageEntryExists() {
  return localStorage[localStorageItemName] !== undefined;
}
export function saveToLocalStorage(text) {
  localStorage.setItem(localStorageItemName, text);
}
export function getFromLocalStorage() {
  return localStorage[localStorageItemName];
}