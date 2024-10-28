import { markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';

import { dataPropertiesStore } from './predefined/data-props-store';
import { layoutPropertiesStore } from './predefined/layout-props-store';
import { propertiesStore } from './predefined/props-store';

export const defaultAllProps = {
  ...propertiesStore,
  ...dataPropertiesStore,
  ...layoutPropertiesStore,
};
import brace from 'brace';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/theme/github';

import 'brace/mode/coffee';
import 'brace/theme/vibrant_ink';
import 'brace/keybinding/vim';

export class ControlProp {
  prop; // Property object from propertiesStore
  /* name */
  /* title */
  /* type */
  /* placeholder */
  /* required */
  /* options */
  /* value */
  editor; // Only for HTML type

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
          addEmptyOption: this.prop.addEmptyOption,
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
    if (this.prop.type === 'boolean' || this.prop.type === 'checkbox') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    }
    if (this.prop.type === 'select-boxes') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    }

    if (this.prop.name === CONTROL_PROPS_TYPES.CUSTOM_CLASS || this.prop.type === 'select') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    } else if (['string', 'number', 'email', 'date', 'textarea'].includes(this.prop.type)) {
      $(`#${this.id}`).on('input', { context, prop: this.prop }, cb);
    }
    if (this.prop.type === 'html') {
      const hiddenElementId = `#${this.id}-hidden`;
      this.editor = brace.edit(this.id, 'session JC');
      this.editor.setTheme('ace/theme/github');
      this.editor.setValue(this.prop.value);
      console.log(this.editor);

      $(hiddenElementId).on('change', { context, prop: this.prop }, cb);
      $(`#${this.id} textarea`).on(' keydown input', { editor: this.editor }, (event) => {
        const { editor } = event.data;
        const hiddenElementId = `#${this.id}-hidden`;

        if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
          return;
        }
        if (event.type != 'input' && !['Backspace', 'Delete'].includes(event.key)) {
          return;
        }
        const value = (editor.session.doc.$lines ?? []).join('\n');
        $(hiddenElementId).val(value).trigger('change');
      });
    }
  }
}

export function _renderProp(basicProps, options = [], required = false) {
  const { id, type, value, placeholder, dataKey, dataRowId } = basicProps;
  const inputType = type === 'boolean' ? 'checkbox' : type === 'string' ? 'text' : type;

  const generalProps = {
    id,
    required,
    'data-key': dataKey,
    'data-rowId': dataRowId,
  };

  if (inputType === 'select') {
    const selectEl = markup('select', '', {
      ...generalProps,
      class: 'form-select',
    });
    if (basicProps.addEmptyOption) {
      selectEl.appendChild(markup('option', '', { value: '' }));
    }
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const optionEl = document.createElement('option');
      for (const key in option) {
        optionEl[key] = option[key];
      }
      if (option['value'] === value) {
        optionEl.selected = true;
      }
      selectEl.appendChild(optionEl);
    }
    return selectEl;
  }
  if (inputType === 'checkbox') {
    const checkboxProps = {
      ...generalProps,
      type: inputType,
      class: 'form-check-input',
    };
    if (value) {
      checkboxProps.checked = value;
    }
    return markup('input', '', checkboxProps);
  }

  if (inputType === 'array') {
    return markup('h3', 'Invalid table data.');
  }

  if (inputType === 'textarea') {
    return markup('textarea', value, {
      ...generalProps,
      class: 'form-control',
      rows: 3,
      placeholder,
    });
  }

  if (inputType === 'select-boxes') {
    const selectBoxes = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'checkbox',
        id: `id-${id}-${i}`,
        name: basicProps.name,
        value: opt.value,
        class: 'form-check-input',
      };

      try {
        if (value.includes(opt.value) && value !== '') {
          customProps.checked = true;
        }
      } catch (error) {}

      selectBoxes.push(
        markup(
          'div',
          [
            markup('input', '', customProps),
            markup('label', opt.text, { for: customProps.id, class: 'form-check-label' }),
          ],
          { class: 'form-check' },
        ),
      );
    }

    return markup('div', selectBoxes, { id });
  }

  if (inputType === 'html') {
    const element = markup('div', value, {
      ...generalProps,
      class: 'html-editor',
    });
    const hiddenEditor = markup('input', '', {
      value,
      type: 'hidden',
      id: `${id}-hidden`,
    });
    return markup('div', [element, hiddenEditor]);
  }

  return markup('input', '', {
    ...generalProps,
    type: inputType,
    value,
    placeholder,
    class: 'form-control',
  });
}
