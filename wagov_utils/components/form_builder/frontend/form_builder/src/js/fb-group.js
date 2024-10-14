import { CONTROL_TYPES } from '../controls/utils/control-types';
import Control from './fb-control';

export default class FBGroup extends Control {
  children = []; // Control elements
  isEmpty = true;

  constructor(element_type, attr = {}, props = {}) {
    super(attr, props, CONTROL_TYPES.GROUP);
  }

  addElement(element) {
    this.children.push(element);
    this.isEmpty = false;
  }

  removeElement(element) {
    this.children = this.children.filter((child) => child.id !== element.id);
    this.isEmpty = this.children.length === 0;
  }

  render() {
    console.log('Rendering FBGroup');
  }
}
