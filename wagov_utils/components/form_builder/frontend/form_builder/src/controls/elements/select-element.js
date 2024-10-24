import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

import { CONTROL_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../utils/control-props-types';
import { SelectDataProperties } from '../config-properties/data-properties';
import { SelectDisplayProps } from '../config-properties/input-properties';

const defaultSettings = {
  value: '',
  label: 'Select Component',
  placeholder: '-- Select an option --',
  width: '100%',
  height: '30px',
};

const basicOptions = [
  {
    value: '',
    text: '-- Select an option --',
    disabled: true,
    selected: true,
  },
  {
    value: '1',
    text: 'Option 1',
  },
  {
    value: '2',
    text: 'Option 2',
  },
];

export default class SelectElement extends InputControl {
  options = basicOptions;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.SELECT);

    this.setup();
  }

  setup() {
    this.displayControlProps = new SelectDisplayProps(this.props);
    this.dataControlProps = new SelectDataProperties(this.props);

    this.options = this.props.options || this.options;
    this.attr['class'] = 'form-select';
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL],
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: props[CONTROL_PROPS_TYPES.PLACEHOLDER],
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

    const options = props?.values ?? this.options;

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    const attributes = {
      id: props.id ?? this.id,
      value: this.value,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
    };
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }

    const selectEl = markup('select', '', attributes);
    if (props[CONTROL_PROPS_TYPES.PLACEHOLDER]) {
      selectEl.append(
        markup('option', props[CONTROL_PROPS_TYPES.PLACEHOLDER], {
          value: '',
          selected: true,
        }),
      );
    }

    if (Array.isArray(options)) {
      options.forEach((option) => {
        const attributes = {
          value: option.value,
        };
        if (option.value === props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]) {
          attributes.selected = true;
        }
        selectEl.appendChild(markup('option', option.text, attributes));
      });
    }
    return super.render(selectEl);
  }
}
