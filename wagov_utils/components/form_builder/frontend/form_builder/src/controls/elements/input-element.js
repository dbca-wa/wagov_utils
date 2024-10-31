import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { INPUT_TYPES } from '../utils/input-types';
import { InputFieldDisplayProps } from '../config-properties/input-properties';
import { CONTROL_DATA_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { InputFieldDataProperties } from '../config-properties/data-properties';
import { ELEMENT_TYPES } from '../utils/element-types';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class InputElement extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.INPUT);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new InputFieldDataProperties(this.type, this.props);
    if (this.type === INPUT_TYPES.RADIO) {
      this.attr['class'] = 'form-check-input';
      this.id = this.props.id;
    } else if (INPUT_TYPES.CHECK_BOX == this.attr.type) {
      this.attr['class'] = 'form-check-input';
      this.label.attr.for = this.id;
      this.label.attr.class = 'form-check-label';
      this.container_class = 'form-check';
    } else {
      this.attr['class'] = 'form-control';
    }
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
      value: value,
    };

    if (this.type === 'radio') {
      attributes.name = this.props.name;
      delete attributes.placeholder;
      delete attributes.value;
    }
    if (this.type === 'checkbox') {
      attributes.name = this.props.name;
      attributes.checked = value === true;

      delete attributes.placeholder;
      delete attributes.value;
    }
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    return super.render(markup('input', '', attributes));
  }
}
