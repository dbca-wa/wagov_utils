import { markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';

import { dataPropertiesStore } from './predefined/data-props-store';
import { propertiesStore } from './predefined/props-store';

export const defaultAllProps = {
  ...propertiesStore,
  ...dataPropertiesStore,
};

export class ControlProp {
  prop; // Property object from propertiesStore
  /* name */
  /* title */
  /* type */
  /* placeholder */
  /* required */
  /* options */
  /* value */

  constructor(type, customPropsStore) {
    this.prop = customPropsStore !== undefined ? { ...customPropsStore[type] } : { ...defaultAllProps[type] };
    this.id = `cp-${this.prop.name}`;
  }

  renderProp() {
    const children = [
      markup('label', this.prop.title, {
        for: this.id,
        class: this.prop.type === 'boolean' ? 'form-check-label' : 'form-label',
      }),
      _renderProp(
        {
          id: this.id,
          type: this.prop.type,
          value: this.prop.value,
          name: this.prop.name,
          placeholder: this.prop.placeholder,
          structure: this.prop.structure,
        },
        this.prop.options,
        this.prop.required,
      ),
    ];
    if (this.prop.type === 'boolean') {
      children.reverse();
    }
    return markup('div', children, { class: 'form-check mb-3' });
  }

  addChangeEvent(context, cb) {
    if (!cb) return;
    if (this.prop.type === 'boolean') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    }

    if (this.prop.name === CONTROL_PROPS_TYPES.CUSTOM_CLASS || this.prop.type === 'select') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    } else if (this.prop.type === 'string') {
      $(`#${this.id}`).on('input', { context, prop: this.prop }, cb);
    }
  }
}

export function _renderProp(basicProps, options = [], required = false) {
  const { id, type, value, placeholder, dataKey } = basicProps;
  const inputType = type === 'boolean' ? 'checkbox' : type === 'string' ? 'text' : type;

  if (inputType === 'select') {
    const selectEl = markup('select', '', { id, required, class: 'form-select', 'data-key': dataKey });
    options.forEach((option) => {
      const optionEl = document.createElement('option');
      for (const key in option) {
        if (option.hasOwnProperty(key)) {
          optionEl[key] = option[key];
        }
      }
      if (optionEl['value'] === value) {
        optionEl.selected = true;
      }
      selectEl.appendChild(optionEl);
    });
    return selectEl;
  }
  if (inputType === 'checkbox') {
    const checkboxProps = { id, type: inputType, required, class: 'form-check-input', 'data-key': dataKey };
    if (value) {
      checkboxProps.checked = value;
    }
    return markup('input', '', checkboxProps);
  }

  if (inputType === 'array') {
    return markup('h3', 'Invalid table data.');
  }

  return markup('input', '', {
    id,
    type: inputType,
    value,
    placeholder,
    required,
    class: 'form-control',
    'data-key': dataKey,
  });
}
