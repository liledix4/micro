import { imp } from './import.js';
let imported = {};
await imp(imported, './events.js', ['setEvents']);
await imp(imported, './input_placeholder.js', ['setPlaceholder']);
await imp(imported, './local_storage.js', ['getFromLocalStorage', 'localStorageEntryExists']);
await imp(imported, './overflow_shadows.js', ['overflowShadows_ALL']);
await imp(imported, './plaintext2fountain.js', ['plainText2Fountain']);
await imp(imported, './selectors.js', ['selector']);
await imp(imported, './zoom.js', ['resultZoomReset']);


if (imported.localStorageEntryExists())
  imported.selector.input.value = imported.getFromLocalStorage();
if (imported.selector.input.value !== '')
  imported.plainText2Fountain();
imported.resultZoomReset();
imported.setEvents();
imported.setPlaceholder();
imported.overflowShadows_ALL();