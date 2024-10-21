import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { INPUT_TYPES } from '../utils/input-types';
import { InputFieldDisplayProps } from '../config-properties/input-properties';
import { CONTROL_DATA_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class InputElement extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, attr.type);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
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

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      id: this.id,
      name: this.props.name,
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: props[CONTROL_PROPS_TYPES.PLACEHOLDER],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
      [CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE]: props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE] ?? 'ff',
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      value: this.value,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
      value: props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE],
    };

    if (this.type === 'radio') {
      attributes.name = this.props.name;
      delete attributes.placeholder;
      delete attributes.value;
    }
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];

    return super.render(markup('input', '', attributes));
  }
}
