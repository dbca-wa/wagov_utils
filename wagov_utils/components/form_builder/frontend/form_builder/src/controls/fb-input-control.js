import { ELEMENT_TYPES } from './utils/element-types';
import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { markup } from '../js/utils';
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
import { BuildArea } from '../js/fb-build-area';

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
  container_class = '';
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
    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      BuildArea.getInstance().generateAPIFieldName(this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? this.type);

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

  modifyProps(props) {
    // This method should be overridden by the child class
    // It's meant to modify some props before rendering the control
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

  render(inputGroup = []) {
    const props = this.displayControlProps.getPropsValues();
    const labelPosition = props[CONTROL_PROPS_TYPES.LABEL_POSITION] ?? 'top';
    if (!Array.isArray(inputGroup)) {
      inputGroup = [inputGroup];
    }

    const tooltip = this.tooltip
      ? markup('i', '', {
          class: 'bi bi-question-circle-fill label-tooltip',
          'data-bs-toggle': 'tooltip',
          'data-bs-title': this.tooltip,
        })
      : undefined;
    const labelElement = this.label.render();
    const description = this.description ? markup('small', this.description, { class: 'form-text' }) : undefined;
    const invalidField = markup('div', '', { class: CLASS_INVALID_FIELD_VALUE });
    const labelGroup = [];

    if (this.isShowLabel()) {
      labelGroup.push(labelElement);
    }
    if (tooltip) labelGroup.push(tooltip);

    const isCheckbox = this.type === ELEMENT_TYPES.CHECK_BOX;
    if (description) {
      if (!isCheckbox) {
        inputGroup.push(description);
        inputGroup.push(markup('br'));
      }
    }
    if (isCheckbox) {
      const isLeftAlign = labelPosition === 'left';

      if (isLeftAlign) {
        inputGroup.push(invalidField);
        const checkBoxDiv = labelGroup.concat(inputGroup);
        return markup(
          'div',
          [markup('div', checkBoxDiv, { class: 'd-flex form-flex-checkbox-left' }), description],
          {},
        );
      } else {
        labelGroup.push(invalidField);
        const checkBoxDiv = inputGroup.concat(labelGroup);
        return markup(
          'div',
          [markup('div', checkBoxDiv, { class: 'd-flex form-flex-checkbox-right' }), description],
          {},
        );
      }
    }

    inputGroup.push(invalidField);
    if (['left', 'right'].includes(labelPosition)) {
      const divLabel = markup('div', labelGroup, { class: 'col-sm-2 pt-1' });
      const divInput = markup('div', inputGroup, {
        class: ['col-sm-10', isCheckbox ? 'align-items-center' : ''].join(' '),
      });
      const mainDiv = [divLabel, divInput];

      return markup('div', labelPosition === 'left' ? mainDiv : mainDiv.reverse(), {
        class: [this.container_class ?? '', 'row', 'align-items-start'].join(' '),
      });
    }

    return markup('div', labelPosition === 'top' ? labelGroup.concat(inputGroup) : inputGroup.concat(labelGroup), {
      class: this.container_class,
    });
  }

  afterRender() {
    const props = this.displayControlProps?.getPropsValues();
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) {
      $(this.getIdSelector()).mask(props[CONTROL_PROPS_TYPES.DISPLAY_MASK]);
    }
  }
}
