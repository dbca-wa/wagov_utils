import { ELEMENT_TYPES } from './utils/element-types';
import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { camelCase, markup } from '../js/utils';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from './utils/control-props-types';
import { BasicAPIProps } from './config-properties/api-props/basic-api-properties';
import { InputFieldValidationProps } from './config-properties/validation-props/input-validation-properties';
import { CLASS_INVALID_FIELD_VALUE } from './utils/constants';
import { runInputFieldValidations } from '../js/validation-utils';
import { INPUT_TYPES } from './utils/input-types';

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
    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      camelCase((this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? '').toString().trim().replace(' ', ''));
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

  getElementValue() {
    if (this.elementType === INPUT_TYPES.RADIO) {
      return $(this.getIdSelector()).find('input[type="radio"]:checked').val() ?? '';
    }
    if (this.type === INPUT_TYPES.CHECK_BOX) {
      return $(this.getIdSelector()).is(':checked');
    }
    if (this.type === INPUT_TYPES.NUMBER) {
      return $(this.getIdSelector()).val() ? parseFloat($(this.getIdSelector()).val()) : null;
    }
    const props = this.getPropsObject();
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) return $(this.getIdSelector()).cleanVal();
    return $(this.getIdSelector()).val().trim();
  }

  getFieldValue() {
    if (!this.apiControlProps) return {};
    const props = this.apiControlProps.getPropsValues();
    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: this.getElementValue(),
    };
  }

  validateValue() {
    const validationProps = this.validationControlProps?.getPropsValues();

    const value = this.getElementValue();
    const errors = runInputFieldValidations(value, this);
    let errorMessage = '';
    if (errors.length > 0) {
      errorMessage = validationProps[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(this.getIdSelector()).parent().find(`.${CLASS_INVALID_FIELD_VALUE}`).text(errorMessage);
    return errors.length === 0;
  }

  renderControl(isDisplayMode = false) {
    const props = this.displayControlProps?.getPropsValues();
    Object.assign(
      props,
      this.dataControlProps?.getPropsValues(),
      this.validationControlProps?.getPropsValues(),
      this.apiControlProps?.getPropsValues(),
    );
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
    children.push(markup('div', '', { class: CLASS_INVALID_FIELD_VALUE }));

    return markup('div', children, { class: this.container_class });
  }

  afterRender() {
    const props = this.displayControlProps?.getPropsValues();
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) {
      $(this.getIdSelector()).mask(props[CONTROL_PROPS_TYPES.DISPLAY_MASK]);
    }
  }
}
