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
  element_type;
  onDrop = () => {};
  onRemove = () => {};

  constructor(attr, props, element_type) {
    super(attr, props, CONTROL_TYPES.LAYOUT);
    this.label = new Label(props['label'] || ''); // Default label
    this.areaId = ['area-', generateRandomId()].join('');
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

  renderControl(children = []) {
    return this.render(children);
  }

  render(children = []) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    return markup('div', children, { class: this.container_class });
  }
}
