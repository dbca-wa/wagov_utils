import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';
import { ButtonDisplayProps } from '../config-properties/input-properties';
import Control from '../../js/fb-control';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { BasicDataProperties } from '../config-properties/data-properties';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {
  [CONTROL_PROPS_TYPES.LABEL]: 'Button',
  [CONTROL_PROPS_TYPES.THEME]: 'primary',
};

export default class ButtonElement extends Control {
  constructor(attr = { value: 'default' }, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.BUTTON, 'bt-' + generateRandomId());
    this.setup();
  }

  setup() {
    this.displayControlProps = new ButtonDisplayProps(this.props);
    this.dataControlProps = new BasicDataProperties({});
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();

    return this.render({
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS],
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
      [CONTROL_PROPS_TYPES.ACTION]: props[CONTROL_PROPS_TYPES.ACTION],
      [CONTROL_PROPS_TYPES.TOOLTIP]: props[CONTROL_PROPS_TYPES.TOOLTIP],

      [CONTROL_PROPS_TYPES.THEME]: props[CONTROL_PROPS_TYPES.THEME],
      [CONTROL_PROPS_TYPES.SIZE]: props[CONTROL_PROPS_TYPES.SIZE],
      [CONTROL_PROPS_TYPES.BLOCK_BUTTON]: props[CONTROL_PROPS_TYPES.BLOCK_BUTTON],
      [CONTROL_PROPS_TYPES.LEFT_ICON]: props[CONTROL_PROPS_TYPES.LEFT_ICON],
      [CONTROL_PROPS_TYPES.RIGHT_ICON]: props[CONTROL_PROPS_TYPES.RIGHT_ICON],
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const label = props[CONTROL_PROPS_TYPES.LABEL];
    const containerClass = props[CONTROL_PROPS_TYPES.BLOCK_BUTTON] ? 'd-grid' : '';
    const tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    const className = [
      'btn',
      `btn-${props[CONTROL_PROPS_TYPES.THEME]}`,
      props[CONTROL_PROPS_TYPES.SIZE] ? `${props[CONTROL_PROPS_TYPES.SIZE]}` : '',
      props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
    ];

    const attributes = {
      id: props.id ?? this.id,
      class: className.join(' '),
      type: props[CONTROL_PROPS_TYPES.ACTION],
    };

    const children = [];
    const elements = [];
    if (props[CONTROL_PROPS_TYPES.LEFT_ICON]) {
      children.push(markup('i', '', { class: props[CONTROL_PROPS_TYPES.LEFT_ICON] }));
    }
    children.push(label);
    if (props[CONTROL_PROPS_TYPES.RIGHT_ICON]) {
      children.push(markup('i', '', { class: props[CONTROL_PROPS_TYPES.RIGHT_ICON] }));
    }

    if (tooltip) {
      attributes.class += ' label-tooltip';
      attributes['data-bs-toggle'] = 'tooltip';
      attributes['data-bs-title'] = tooltip;
    }

    elements.push(markup('button', children, attributes));

    return super.render(elements, containerClass);
  }
}
