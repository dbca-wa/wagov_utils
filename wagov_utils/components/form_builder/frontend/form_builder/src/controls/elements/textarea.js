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
  [CONTROL_PROPS_TYPES.TEXTAREA_ROWS]: 5,
};

export default class TextAreaElement extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, attr.type);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new InputFieldDataProperties(this.type, this.props);
    this.attr['class'] = 'form-control';
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      id: this.id,
      name: this.props.name,
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: props[CONTROL_PROPS_TYPES.PLACEHOLDER],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
      [CONTROL_PROPS_TYPES.DESCRIPTION]: props[CONTROL_PROPS_TYPES.DESCRIPTION] ?? '',
      [CONTROL_PROPS_TYPES.TOOLTIP]: props[CONTROL_PROPS_TYPES.TOOLTIP] ?? '',
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
      [CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE]: props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE] ?? '',
      [CONTROL_PROPS_TYPES.TEXTAREA_ROWS]: props[CONTROL_PROPS_TYPES.TEXTAREA_ROWS] ?? 5,
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      value: this.value,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
      value: value,
      rows: props[CONTROL_PROPS_TYPES.TEXTAREA_ROWS],
    };

    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    return super.render(markup('textarea', '', attributes));
  }
}
