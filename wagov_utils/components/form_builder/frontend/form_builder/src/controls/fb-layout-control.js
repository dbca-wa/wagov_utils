import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { generateRandomId, markup } from '../js/utils';

export default class LayoutControl extends Control {
  container_class = 'formarea-control';
  children = [];
  dropables = {};
  areaId;
  onDrop = () => {};
  onRemove = () => {};

  constructor(attr, props, elementType) {
    super(attr, props, CONTROL_TYPES.LAYOUT);
    this.label = new Label(props['label'] || ''); // Default label
    this.areaId = ['area-', generateRandomId()].join('');
    if (elementType) this.elementType = elementType;

    this._basicSetup();
  }

  _basicSetup() {
    this.container_class = this.props?.container_class || this.container_class;
  }

  setup() {
    console.log('Setup method called');
  }

  getPropsObject() {
    return {
      ...this.displayControlProps?.getPropsValues(),
      ...this.dataControlProps?.getPropsValues(),
      ...this.props,
    };
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      // attr: this.attr,
      props: this.getPropsObject(),
      areaId: this.areaId,
      parentAreaId: this.parentAreaId,
    };
    if (this.children.length) {
      json.children = this.children.map((c) => c.toJSON());
    }

    return json;
  }

  getFieldValues() {
    const values = {};
    for (let i = 0; i < this.children.length; i++) {
      const elm = this.children[i];
      if (elm.children?.length > 0) {
        Object.assign(values, elm.getFieldValues());
      }
      if (typeof elm?.getFieldValue === 'function') {
        Object.assign(values, elm.getFieldValue());
      }
    }
    return values;
  }

  toDisplay(container) {
    const parent = markup('div', '', { class: this.container_class, id: this.id });
    container.append(parent);
    for (let i = 0; i < this.children.length; i++) {
      const column = this.children[i];
      column.toDisplay(parent);
    }
  }

  renderControl(displayMode) {
    return this.render(children);
  }

  render(children = []) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    return markup('div', children, { class: this.container_class });
  }
}
