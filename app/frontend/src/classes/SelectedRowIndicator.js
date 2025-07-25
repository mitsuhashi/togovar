import { storeManager } from '../store/StoreManager';
import { TR_HEIGHT } from '../global.js';

export default class SelectedRowIndicator {
  constructor(elm) {
    this.elm = elm;
    storeManager.bind('selectedRow', this);
  }

  selectedRow(index) {
    if (index === undefined) {
      this.elm.classList.remove('-shown');
    } else {
      this.elm.classList.add('-shown');
      this.elm.style.top = `${TR_HEIGHT * index}px`;
    }
  }
}
