import { ELEMENT_TYPES } from './utils/element-types';
import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { markup } from '../js/utils';
import { CONTROL_PROPS_TYPES } from './utils/control-props-types';
import { BasicAPIProps } from './config-properties/api-props/basic-api-properties';
import { InputFieldValidationProps } from './config-properties/validation-props/input-validation-properties';

function extractLabelProps(props = {}) {
  const labelProps = {};
  for (let key in props) {
    if (key.startsWith('label') && key !== 'label') {
      let _key = key.replace('label', '').toLowerCase();
      labelProps[_key] = props[key];
    }
  }
  return labelProps;
}

export default class InputControl extends Control {
  container_class = 'formarea-control';
  elementType;
  description;
  tooltip;
  constructor(attr, props, elementType) {
    super(attr, props, CONTROL_TYPES.ELEMENT);
    this.elementType = elementType || ELEMENT_TYPES.INPUT;
    this.label = new Label(props['label'] || '', extractLabelProps(props)); // Default label
    this._basicSetup();
  }

  _basicSetup() {
    this.container_class = this.props?.container_class || this.container_class;
    this.dataControlProps = {};
    this.validationControlProps = new InputFieldValidationProps(this.elementType, this.props);
    this.apiControlProps = new BasicAPIProps(this.elementType, this.props);
  }

  setup() {
    console.log('Setup method called');
  }

  isShowLabel() {
    return this.label.text !== '' && !this.displayControlProps.props[CONTROL_PROPS_TYPES.HIDE_LABEL]?.value;
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      parentAreaId: this.parentAreaId,
      attr: this.attr,
      props: this.getPropsObject(),
    };
    return json;
  }
  getAttributes() {
    const attributes = {};
    for (let key in this.attr) {
      attributes[key] = this.attr[key];
    }
    return attributes;
  }

  renderControl(isDisplayMode = false) {
    const props = this.displayControlProps?.getPropsValues();
    Object.assign(props, this.dataControlProps?.getPropsValues());
    if (!isDisplayMode) {
      delete props[CONTROL_PROPS_TYPES.HIDDEN];
      delete props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    }
    return this.render({
      id: this.id,
      name: this.props.name,
      ...props,
    });
  }

  render(children = []) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    const tooltip = this.tooltip
      ? markup('i', '', {
          class: 'bi bi-question-circle-fill label-tooltip',
          'data-bs-toggle': 'tooltip',
          'data-bs-title': this.tooltip,
        })
      : undefined;
    if (this.isShowLabel()) {
      if (this.elementType === ELEMENT_TYPES.CHECK_BOX) {
        children.push(this.label.render());
        if (tooltip) children.push(tooltip);
      } else {
        if (tooltip) children.unshift(tooltip);
        children.unshift(this.label.render());
      }
    }

    if (this.description) {
      children.push(markup('small', this.description, { class: 'form-text' }));
    }

    return markup('div', children, { class: this.container_class });
  }
}
