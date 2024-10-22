import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

import { CONTROL_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../utils/control-props-types';
import { RadioDisplayProps } from '../config-properties/input-properties';
import { RadioButtonsDataProperties } from '../config-properties/data-properties';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {};
const defaultOptions = [
  {
    text: 'Option 1',
    value: 'opt1',
  },
  {
    text: 'Option 2',
    value: 'opt2',
  },
];

export default class RadioButton extends InputControl {
  options = defaultOptions;

  constructor(attr = {}, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.RADIO);
    this.setup();
  }

  setup() {
    this.name = 'rb-' + generateRandomId();
    this.displayControlProps = new RadioDisplayProps(this.props);
    this.dataControlProps = new RadioButtonsDataProperties(this.props);

    this.options = this.props.values || this.options;
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      id: this.id,
      name: this.props.name,
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
      [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE],
      [DATASOURCE_PROPS_TYPES.VALUES]: props[DATASOURCE_PROPS_TYPES.VALUES],
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const options = props?.values ?? this.options;

    const radioButtons = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'radio',
        id: `${this.name}-${i}`,
        name: this.name,
        value: opt.value,
        class: 'form-check-input',
      };
      if (props[CONTROL_PROPS_TYPES.DISABLED]) {
        customProps.disabled = true;
      }
      if (props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE] === opt.value) {
        customProps.checked = true;
      }

      radioButtons.push(
        markup(
          'div',
          [
            markup('input', '', customProps),
            markup('label', opt.text, { for: `${this.name}-${i}`, class: 'form-check-label' }),
          ],
          { class: 'form-check' },
        ),
      );
    }
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];

    return markup('div', [this.label.render(), ...radioButtons], { class: 'form-group' });
  }
}
