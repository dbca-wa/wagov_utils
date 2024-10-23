import { ELEMENT_TYPES } from './utils/element-types';
import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { generateRandomId, markup } from '../js/utils';
import { CONTROL_PROPS_TYPES } from './utils/control-props-types';
import { BasicDataProperties } from './config-properties/data-properties';

export default class LayoutControl extends Control {
  container_class = 'formarea-control';
  areaId;

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
    this.dataControlProps = new BasicDataProperties({});
  }

  setup() {
    console.log('Setup method called');
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
