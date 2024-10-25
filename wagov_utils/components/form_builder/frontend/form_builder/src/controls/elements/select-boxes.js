import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { InputFieldDisplayProps } from '../config-properties/input-properties';
import { CONTROL_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../utils/control-props-types';
import { SelectBoxesDataProperties } from '../config-properties/data-properties';
import { ELEMENT_TYPES } from '../utils/element-types';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class SelectBoxes extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.SELECT_BOXES);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new SelectBoxesDataProperties(this.props);
    this.name = 'sb-' + generateRandomId();
    this.container_class = 'form-group';
    this.options = this.props.values || this.options;
  }
  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS],
      [CONTROL_PROPS_TYPES.DISABLED]: props[CONTROL_PROPS_TYPES.DISABLED],
      [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE],
      [DATASOURCE_PROPS_TYPES.VALUES]: props[DATASOURCE_PROPS_TYPES.VALUES],
      [CONTROL_PROPS_TYPES.DESCRIPTION]: props[CONTROL_PROPS_TYPES.DESCRIPTION] ?? '',
      [CONTROL_PROPS_TYPES.TOOLTIP]: props[CONTROL_PROPS_TYPES.TOOLTIP] ?? '',
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();

    const options = props[DATASOURCE_PROPS_TYPES.VALUES] ?? this.options;

    const attributes = {
      id: props.id ?? this.id,
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
    };
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }

    const selectBoxes = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'checkbox',
        id: `${this.name}-${i}`,
        name: this.name,
        value: opt.value,
        class: 'form-check-input',
      };
      if (props[CONTROL_PROPS_TYPES.DISABLED]) {
        customProps.disabled = true;
      }
      try {
        if (props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE].includes(opt.value)) {
          customProps.checked = true;
        }
      } catch (error) {}

      selectBoxes.push(
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
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];

    const elements = selectBoxes;
    return super.render(markup('div', elements, { class: this.container_class }));
  }
}
