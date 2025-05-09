import { generateRandomId, markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';

import { dataPropertiesStore, datasourceDataPropertiesStore } from './predefined/data-props-store';
import { propertiesStore } from './predefined/props-store';

const allProps = {
  ...propertiesStore,
  ...dataPropertiesStore,
};

export default class ControlProp {
  prop; // Property object from propertiesStore
  /* name */
  /* title */
  /* type */
  /* placeholder */
  /* required */
  /* options */
  /* value */

  constructor(type, customPropsStore) {
    this.prop = customPropsStore !== undefined ? { ...customPropsStore[type] } : { ...allProps[type] };
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
          structure   : this.prop.structure
        },
        this.prop.options,
        this.prop.required,
      ),
    ];
    if (this.prop.type === 'boolean') {
      children.reverse();
    }
    return markup('div', children, { id: this.id, class: 'form-check mb-3' });
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

function _renderProp(basicProps, options = [], required = false) {
  const { id, type, value, placeholder, } = basicProps;
  const inputType = type === 'boolean' ? 'checkbox' : type === 'string' ? 'text' : type;

  if (inputType === 'select') {
    const selectEl = markup('select', '', { id, required, class: 'form-select' });
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
    const checkboxProps = { id, type: inputType, required, class: 'form-check-input' };
    if (value) {
      checkboxProps.checked = value;
    }
    return markup('input', '', checkboxProps);
  }

  if (inputType === 'array') {
    const {structure } = basicProps
   try {
     
    const table = new EditableDynamicTableControl(structure, value, true);
    return table.render();

  } catch (error) {
    console.error(error);
    return markup('h3', 'Invalid table data.');
    
   }
  }

  return markup('input', '', { id, type: inputType, value, placeholder, required, class: 'form-control' });
}

export class EditableDynamicTableControl {
  name;
  id;
  constructor(structure, values) {
    this.id = "table-"+generateRandomId();
    this.structure = structure;
    this.values = values === "" ? [] : values
    this.columns = ['id'].concat(Object.keys(structure).map((key) => structure[key].name)).concat('actions');

  }

  static _createColumn(column) {
      return markup('th', column, { scope: 'col' });
  }
  _createRow(row) {
    if(!row) return;
    const rowEl = markup('tr', markup('td', markup('span', 'X', {class: 'btn btn-default ' + this.name})));
    for (const column of this.columns) {
      if (column === 'actions') {
        rowEl.appendChild(markup('td', row[column]));
        continue;
      }
      if(this.structure[column]){
        rowEl.appendChild(markup('td', _renderProp({...this.structure[column], value: row[column]})));
      }
    }
    return rowEl
  }

    render () {
    const table = markup('table', [{
      tag: 'thead',
      content : [
        {tag: 'tr', content: this.columns.map((column) => EditableDynamicTableControl._createColumn(column))}
      ]
    }], { class: 'table table-bordered', id: this.id });
    
    
    const tbody = markup('tbody', '',);
    table.appendChild(tbody);
    const tableBody = this.values.map(val=> {
      
      return {
        ...val,
        actions: markup('button', 'Edit', {class: 'btn btn-primary ' + this.name, events: {
          click: (e) => {
            e.preventDefault()
            console.log('Edit', e);
          }
        }})
      }
    })
    for (let i = 0; this.values.length; i++) {
      
      table.querySelector('tbody').appendChild(this._createRow(tableBody[i]));
    }
    const addRowButton = markup('button', 'Add row', {class: 'btn btn-primary '});
    addRowButton.addEventListener('click', this, (e) => {
      e.preventDefault();
      // const _this = e.data;
      // const newRow = {};
      // Object.keys(_this.structure).map((key) => {
      //   newRow[key] = _this.structure[key].value;  
      // })
      
      // const row = _this._createRow(newRow);
      // $(_this.id).querySelector('tbody').appendChild(row);
    })
    table.querySelector('tbody').appendChild(addRowButton);
    return table;
  }

}