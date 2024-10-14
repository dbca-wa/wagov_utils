import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {};

export default class Checkbox extends InputControl {
  id = 'cb-' + generateRandomId();
  constructor(attr = { value: 'default' }, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.CHECK_BOX);
    this.setup();
  }

  setup() {
    this.displayControlProps = new RadioDisplayProps(this.props);
    this.options = this.props.options || this.options;
    this.label.attr.for = this.id;
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();

    return this.render({
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: props[CONTROL_PROPS_TYPES.PLACEHOLDER],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS],
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
    });
  }

  render() {
    const inputElement = markup('input', '', { type: 'checkbox', id: this.id, ...this.attr });
    return super.render(inputElement);
  }
}
