import { setEvents } from "./events.js";
import { setPlaceholder } from "./input_placeholder.js";
import { getFromLocalStorage, localStorageEntryExists } from "./local_storage.js";
import { overflowShadows_ALL } from "./overflow_shadows.js";
import { plainText2Fountain } from "./plaintext2fountain.js";
import { selector } from "./selectors.js";
import { resultZoomReset } from "./zoom.js";


if (localStorageEntryExists())
  selector.input.value = getFromLocalStorage();
if (selector.input.value !== '')
  plainText2Fountain();
resultZoomReset();
setEvents();
setPlaceholder();
overflowShadows_ALL();