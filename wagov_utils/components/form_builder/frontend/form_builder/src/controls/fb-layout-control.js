import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { generateRandomId, markup } from '../js/utils';
import { BasicDataProperties } from './config-properties/data-properties';

export default class LayoutControl extends Control {
  container_class = 'formarea-control';
  children = [];
  dropables = {};
  areaId;
  onDrop = () => {};
  onRemove = () => {};

  constructor(attr, props, element_type) {
    super(attr, props, CONTROL_TYPES.LAYOUT);
    this.label = new Label(props['label'] || ''); // Default label
    this.areaId = ['area-', generateRandomId()].join('');
    if (element_type) this.element_type = element_type;

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
      element_type: this.element_type,
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
