import { selector } from "./selectors.js";


export function setPlaceholder() {
  selector.input.setAttribute('placeholder', ':Featuring\nC1: Character #1\nC2: Character #2\n\nInt. Room\n\nC1: Hi!\nC2: Ayo, what\'s up?\n\n@C1 takes time to think.\n\nC1: (with excitement) A ceiling!');
}