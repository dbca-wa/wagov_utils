import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

import InputElement from './input-element';

import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { RadioDisplayProps } from '../config-properties/input-properties';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {
  options: [
    {
      text: 'Option 1',
    },
    {
      text: 'Option 2',
    },
  ],
};

export default class RadioButton extends InputControl {
  options;

  constructor(attr = {}, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.RADIO);
    this.setup();
  }

  setup() {
    this.name = 'rb-' + generateRandomId();
    this.displayControlProps = new RadioDisplayProps(this.props);
    this.options = [];
    const opts = this.props.options;

    for (let i = 0; i < opts.length; i++) {
      const { text, value } = opts[i];
      opts[i].name = this.name;

      const elementId = `${this.name}-${i + 1}`;
      const name = this.name;
      const label = `${text} 00${i}`;
      const el = new InputElement(
        { type: ELEMENT_TYPES.RADIO },
        {
          type: ELEMENT_TYPES.RADIO,
          label: label,
          labelFor: elementId,
          labelClass: 'form-check-label',
          name: name,
          id: elementId,
          class: 'form-check-input',
          containerClass: 'form-check',
        },
        ELEMENT_TYPES.RADIO,
      );
      this.options.push(el);
    }
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    return this.render({
      id: this.id,
      name: this.props.name,
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const options = props.options ?? this.options;

    const radioButtons = options.map((opt, i) => {
      const customProps = opt.displayControlProps.getPropsValues();
      if (props[CONTROL_PROPS_TYPES.DISABLED]) {
        customProps.disabled = true;
      }
      return markup('div', opt.render(customProps), { class: 'form-check' });
    });
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];

    return super.render(radioButtons, 'formarea-control');
  }
}
