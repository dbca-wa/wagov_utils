import { format } from 'date-fns';
import { activateTooltips } from '../../js/control-utils';
import { instantiateJsonControl } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { GENERAL_DATE_FORMAT, MAX_NUM_ITEMS_EDITABLE_GRID } from '../utils/constants';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from '../utils/control-props-types';
import { ELEMENT_TYPES } from '../utils/element-types';

class Renderer {
  constructor(control, props = {}) {
    this.control = control;
    this.props = props;
  }

  renderButtons() {}

  afterRender() {}

  render() {
    console.log('Rendering renderer');
  }

  getValues() {
    return this.control.getFieldValues();
  }
}

export class MultiControlRenderer extends Renderer {
  rowsData = [];
  constructor(control, controls, props = {}) {
    super(control, props);
    this.controls = controls;
    this.id = `renderer-${control.id}`;
  }

  getValues() {
    return this.rowsData.map((r) => r.values).filter((r) => r);
  }

  validateRows() {
    return this.rowsData.every((row) => !row.isEditing);
  }

  addRow() {
    const maxItems = this.props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] || MAX_NUM_ITEMS_EDITABLE_GRID;
    if (this.rowsData.length >= maxItems) {
      return;
    }
    const index = $(`#${this.id} .rows .row`).length;
    const rowId = `row-${this.id}-${index}`;
    const rowEdition = markup('div', '', { class: 'row py-2 border-1 border-bottom ', id: rowId });

    const rowData = {
      id: rowId,
      controls: [],
      values: null,
      isEditing: true,
    };
    $(`#${this.id} .rows`).append(rowEdition);

    for (let i = 0; i < this.controls.length; i++) {
      const elm = instantiateJsonControl(this.controls[i].toJSON());

      const col = markup('div', '', { class: 'col control' });
      rowEdition.append(col);
      this.renderControlEdition($(col), elm, elm.getDefaultValue());

      rowData.controls.push(elm);
    }
    const col = markup('div', this.getButtons(rowId), { class: 'col-sm-1 actions' });
    this.rowsData.push(rowData);
    rowEdition.append(col);
    this.enableActionButtons(rowId);

    activateTooltips(rowEdition);
  }

  enableActionButtons(rowId) {
    $(`#${rowId} button.save-row`)?.on('click', this, this.saveRow);
    $(`#${rowId} button.cancel-row`)?.on('click', this, this.cancelRow);
    $(`#${rowId} button.edit-row`)?.on('click', this, this.editRow);
    $(`#${rowId} button.remove-row`)?.on('click', this, this.removeRow);
  }

  getButtons(rowId) {
    const buttonSave = markup('button', 'Save', {
      class: 'btn btn-primary save-row',
      'data-rowId': rowId,
      type: 'button',
    });
    const buttonCancel = markup('button', [{ tag: 'i', class: 'bi bi-x' }, ''], {
      class: 'btn btn-secondary cancel-row',
      'data-rowId': rowId,
      type: 'button',
    });
    const buttonEdit = markup('button', 'Edit', {
      class: 'btn btn-dark edit-row',
      'data-rowId': rowId,
      type: 'button',
      style: 'display: none',
    });
    const buttonRemove = markup('button', [{ tag: 'i', class: 'bi bi-trash' }, ''], {
      class: 'btn btn-danger remove-row',
      'data-rowId': rowId,
      type: 'button',
      style: 'display: none',
    });
    const btnGroup = markup('div', [buttonSave, buttonCancel], {
      class: 'btn-group btn-group-sm',
      role: 'group',
      'aria-label': 'Actions',
    });
    const btnGroup2 = markup('div', [buttonEdit, buttonRemove], {
      class: 'btn-group btn-group-sm',
      role: 'group',
      'aria-label': 'Actions',
    });
    return [btnGroup, btnGroup2];
  }

  saveRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const { controls } = row;
    let isValid = true;
    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const controlValid = control.validateValue();
      isValid &= controlValid;
    }
    if (isValid) {
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        row.values = { ...row.values, ...control.getFieldValue() };
        const container = $(`#${rowId} .control`)[i];
        _this.renderControlDisplay($(container), control);
      }
      row.isEditing = false;
      $(`#${rowId} .actions .edit-row, #${rowId} .actions .remove-row`).show();
      $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).hide();
    }
  }

  cancelRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    if (row && row.values) {
      const { controls } = row;
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        const props = control.getPropsObject();
        const container = $(`#${rowId} .control`)[i];
        _this.renderControlDisplay($(container), control, row.values[props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]);
      }
      row.isEditing = false;
      $(`#${rowId} .actions .edit-row, #${rowId} .actions .remove-row`).show();
      $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).hide();
    } else {
      const index = _this.rowsData.indexOf(row);
      _this.rowsData.splice(index, 1);
      $(`#${rowId}`).remove();
    }
  }

  removeRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const index = _this.rowsData.indexOf(row);
    _this.rowsData.splice(index, 1);
    $(`#${rowId}`).remove();
  }

  editRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const { controls } = row;

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const props = control.getPropsObject();
      const container = $(`#${rowId} .control`)[i];
      _this.renderControlEdition($(container), control, row.values[props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]);
    }
    row.isEditing = true;
    $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).show();
    $(`#${rowId} .actions .edit-row, #${rowId} .actions .remove-row`).hide();
  }

  renderControlEdition(container, control, value) {
    container.empty();
    const elmProps = control.getPropsObject();
    const renderProps = {
      ...elmProps,
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: [elmProps[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '', 'py-2'].join(' '),
      [CONTROL_PROPS_TYPES.HIDE_LABEL]: true,
      [CONTROL_PROPS_TYPES.HIDDEN]: false,
      [CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE]: value,
    };
    if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
      renderProps.values = Array.isArray(value) ? value : [value];
    }
    const renderedElm = control.render(renderProps, { 'data-control-id': control.id });
    container.append(renderedElm);
    control.$p = container;
    control.afterRender();
  }

  renderControlDisplay(container, control, val = undefined) {
    const value = val != undefined ? val : control.getElementValue();

    let controlDisplay = '';
    if (typeof value === 'boolean') {
      controlDisplay = markup('div', {
        tag: 'i',
        class: value ? 'bi bi-check fs-4 text-success' : 'text-muted',
        content: value ? '' : '-',
      });
    } else if (Array.isArray(value)) {
      if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
        controlDisplay = markup('div', value.map((v) => format(v, GENERAL_DATE_FORMAT)).join(' - '));
      } else {
        controlDisplay = markup('div', value.join(', '));
      }
    } else {
      controlDisplay = markup('div', value);
    }
    container.empty();
    container.append(controlDisplay);
  }

  render() {
    const divContainer = markup('div', '', { class: 'r-multi-control', id: this.id });

    const header = markup('div', '', {
      class: 'row p-3 bg-dark bg-opacity-10 border border-3 border-start-0 border-end-0',
    });
    for (let i = 0; i < this.controls.length; i++) {
      const elm = this.controls[i];
      const elmProps = elm.getPropsObject();
      const fieldLabel = elmProps[CONTROL_PROPS_TYPES.LABEL] || elmProps[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      const col = markup('div', fieldLabel, { class: 'col' });
      header.append(col);
    }
    header.append(markup('div', '', { class: 'col-sm-1' }));

    const rows = markup('div', '', { class: 'rows' });
    const buttonAdd = markup('button', [{ tag: 'i', class: 'bi bi-plus' }, 'Add record'], {
      class: 'btn btn-primary add-row mt-2',
      type: 'button',
    });

    divContainer.append(header);
    divContainer.append(rows);
    divContainer.append(buttonAdd);

    return divContainer;
  }

  afterRender() {
    $(`#${this.id} button.add-row`).on('click', () => this.addRow());

    const minItems = this.props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] || 0;
    for (let i = 0; i < minItems; i++) {
      this.addRow();
    }
  }
}

export class MultivalueRenderer extends Renderer {
  constructor(control, element, props = {}) {
    super(control, props);
    this.element = element;
    this.id = `renderer-${control.id}`;
  }

  addRow() {
    const row = markup('div', '', { class: 'd-flex p-1' });

    const buttonRemove = markup(
      'button',
      { tag: 'i', class: 'bi bi-trash ' },
      { class: 'btn btn-danger flex-shrink-1 ms-3' },
    );
    const clone = this.element.cloneNode(true);
    clone.setAttribute('id', `c-${this.control.id}`);
    clone.setAttribute('data-control-id', this.control.id);
    clone.classList.add(['w-80', 'py-2']);
    row.append(clone);
    row.append(buttonRemove);
    $(`#${this.id} .values`).append(row);
    $(row)
      .find('button')
      .on('click', (e) => {
        $(e.currentTarget).parent().remove();
      });
  }

  render() {
    const divContainer = markup('div', '', { class: 'r-multi-value', id: this.id });
    const values = markup('div', '', { class: 'values' });
    const buttonAdd = markup('button', 'Add', { class: 'btn btn-primary add-row mt-2', type: 'button' });
    values.append(this.element);
    divContainer.append(values);
    divContainer.append(buttonAdd);
    return divContainer;
  }
  afterRender() {
    $(`#${this.id} button.add-row`).on('click', () => this.addRow());
  }
}
