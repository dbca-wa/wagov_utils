import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../controls/utils/control-props-types';
import { CONTROL_TYPES } from '../controls/utils/control-types';
import { ELEMENT_TYPES } from '../controls/utils/element-types';
import { activateTooltips, getDatepickerOptionsFromProps, getRelativeDateFromValue } from '../js/control-utils';
import { BuildArea } from '../js/fb-build-area';
import Control from '../js/fb-control';
import { appSelectors } from '../js/selectors';
import { compareMinMaxIntegers, generateRandomId, markup } from '../js/utils';
import controlWrapperTemplate from '../views/control-edition/control-edition-wrapper.handlebars';
import Modal from 'bootstrap/js/dist/modal.js';

export default class ControlEdition extends Control {
  id = 'element-wrapper-' + generateRandomId();
  modal = null;
  initialProps;
  hasSaved = false;
  errors = {};

  constructor(control, controller) {
    super({}, {}, CONTROL_TYPES.BLOCK);
    this.control = control;
    this.controller = controller;
    /* this._editControl({
      data: this,
    }); */
  }
  render() {
    return markup(
      'div',
      controlWrapperTemplate({
        title: 'Text Field',
      }),
      {
        ...this.attr,
        id: this.id,
        class: 'form-field',
        'data-controlId': this.control.id,
        'data-parentAreaId': this.control.parentAreaId,
      },
    );
  }

  addButtonEvents() {
    $(this.getIdSelector()).on('mouseenter mouseleave', this, this._mouseAction);
    $(this.getIdSelector()).find('.act-edit').on('click', this, this._editControl);
    $(this.getIdSelector()).find('.act-remove').on('click', this, this._removeControl);
    $(this.getIdSelector()).find('.act-duplicate').on('click', this, this._duplicateControl);
  }

  _editControl(event) {
    const _this = event.data;
    _this.hasSaved = false;
    const modalIdSelector = `#${appSelectors.modalControlEdition}`;
    const $m = $(modalIdSelector);

    if (_this.control && _this.control.displayControlProps) {
      _this.control.displayControlProps?.setEditor($m.find('#display-tab-pane form'), _this);
      _this.control.dataControlProps?.setEditor($m.find('#data-tab-pane form'), _this);
      _this.control.validationControlProps?.setEditor($m.find('#validation-tab-pane form'), _this);
      _this.control.apiControlProps?.setEditor($m.find('#api-tab-pane form'), _this);

      _this.control.displayControlProps?.renderInParent();
      _this.control.dataControlProps?.renderInParent();
      _this.control.validationControlProps?.renderInParent();
      _this.control.apiControlProps?.renderInParent();

      _this.initialProps = {
        ..._this.control.displayControlProps.getPropsValues(),
        ..._this.control.dataControlProps?.getPropsValues(),
        ..._this.control.validationControlProps?.getPropsValues(),
        ..._this.control.apiControlProps?.getPropsValues(),
      };
      _this._renderPreviewControl();

      $('#display-tab').trigger('click');
      $('#data-tab').show();
      $('#validation-tab').show();
      $('#api-tab').show();
      if (!_this.control.dataControlProps || Object.keys(_this.control.dataControlProps.props).length === 0) {
        $m.find('#data-tab-pane form').empty();
        $('#data-tab').hide();
      }
      if (
        !_this.control.validationControlProps ||
        Object.keys(_this.control.validationControlProps.props).length === 0
      ) {
        $m.find('#validation-tab-pane form').empty();
        $('#validation-tab').hide();
      }
      if (!_this.control.apiControlProps || Object.keys(_this.control.apiControlProps.props).length === 0) {
        $m.find('#api-tab-pane form').empty();
        $('#api-tab').hide();
      }
    }

    _this.modal = new Modal(document.querySelector(modalIdSelector), {
      keyboard: true,
      backdrop: true,
    });
    _this.modal.toggle();

    const myModalEl = document.getElementById(appSelectors.modalControlEdition);
    myModalEl.addEventListener(
      'hidden.bs.modal',
      function (event) {
        _this._closeModal();
      },
      { once: true },
    );
    $m.find('.modal-footer .btn-primary').off('click').on('click', _this, _this._saveControl);
  }

  _renderPreviewControl() {
    const props = {
      ...this.control.displayControlProps.getPropsValues(),
      ...this.control.dataControlProps?.getPropsValues(),
      ...this.control.validationControlProps?.getPropsValues(),
      ...this.control.apiControlProps?.getPropsValues(),
    };
    const errors = this.errors;
    $('#preview-edition').empty().append(this.control.render(props));
    activateTooltips(document, '#preview-edition');
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) {
      $('#preview-edition ' + this.control.getIdSelector()).mask(props[CONTROL_PROPS_TYPES.DISPLAY_MASK]);
    }
    if (this.control.elementType == ELEMENT_TYPES.DATE_PICKER_JQ) {
      $('#preview-edition ' + this.control.getIdSelector()).datepicker(getDatepickerOptionsFromProps(props));
    }
    $('#preview-edition .alert.alert-danger')?.remove();
    if (Object.keys(errors).length > 0) {
      const alertElement = markup('div', '', { class: 'alert alert-danger', role: 'alert' });
      for (let key in errors) {
        alertElement.append(markup('p', `${key}: ${errors[key]}`));
      }

      $('#preview-edition').append(alertElement);
    }
  }

  addError(field, message) {
    this.errors[field] = message;
  }

  removeError(field) {
    delete this.errors[field];
  }

  _saveControl(event) {
    const _this = event.data;
    const props = _this.control.getPropsObject();
    if (props[CONTROL_PROPS_TYPES.LABEL] === '') {
      alert('Label is required');
      $('#display-tab').trigger('click');
      return;
    }
    if (_this.control.validationControlProps) {
      if (
        compareMinMaxIntegers(
          props[CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE],
          props[CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE],
        )
      ) {
        alert('Minimum value must be less than the Maximum value');
        $('#validation-tab').trigger('click');
        return;
      }
      if (
        compareMinMaxIntegers(
          props[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH],
          props[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH],
        )
      ) {
        alert('Minimum Word length must be less than the Maximum value');
        $('#validation-tab').trigger('click');
        return;
      }
      if (
        compareMinMaxIntegers(
          props[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH],
          props[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH],
        )
      ) {
        alert('Minimum length must be less than the Maximum value');
        $('#validation-tab').trigger('click');
        return;
      }
      if (_this.control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
        let minDate = null;
        let maxDate = null;
        if (props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]) {
          minDate = getRelativeDateFromValue(props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]);
        }
        if (props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]) {
          maxDate = getRelativeDateFromValue(props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]);
        }
        if (minDate && maxDate) {
          if (minDate > maxDate) {
            alert('Minimum default date must be earlier than the Maximum default date');
            $('#validation-tab').trigger('click');
            return;
          }
        }
        let startDefaultDate = null;
        let endDefaultDate = null;
        if (props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]) {
          startDefaultDate = getRelativeDateFromValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]);
        }
        if (props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]) {
          endDefaultDate = getRelativeDateFromValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]);
        }
        if (startDefaultDate && endDefaultDate) {
          if (startDefaultDate > endDefaultDate) {
            alert('Start default date must be earlier than the End default date');
            $('#data-tab').trigger('click');
            return;
          }
        }
      }
    }
    if (props[CONTROL_API_PROPS_TYPES.FIELD_NAME] != undefined) {
      const fieldName = props[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      if (fieldName === '') {
        alert('Field name is required');
        $('#api-tab').trigger('click');
        return;
      }

      if (BuildArea.getInstance().fieldNameExists(fieldName) > 1) {
        alert('Field name already exists');
        $('#api-tab').trigger('click');
        return;
      }
    }
    _this.controller.onSave(_this);
    _this.hasSaved = true;
    _this.modal.hide();
  }

  _removeControl(event) {
    const _this = event.data;
    $(_this.getIdSelector()).fadeOut('fast', () => {
      $(_this.getIdSelector()).remove();
      _this.controller.onDelete(_this);
    });
  }

  _duplicateControl(event) {
    const _this = event.data;
    console.log(_this);
    _this.controller.onDuplicate(_this);
  }

  _closeModal() {
    const $m = $(`#${appSelectors.modalControlEdition}`);
    $m.find('#display-tab-pane form').empty();
    $m.find('#data-tab-pane form').empty();
    $m.find('#validation-tab-pane form').empty();
    $m.find('#api-tab-pane form').empty();
    $m.find('#preview-edition').empty();

    if (this.hasSaved) return;

    this.control.displayControlProps.fillInProps(Object.assign({}, this.initialProps));
    this.control.dataControlProps?.fillInProps(Object.assign({}, this.initialProps));
    this.control.validationControlProps?.fillInProps(Object.assign({}, this.initialProps));
    this.control.apiControlProps?.fillInProps(Object.assign({}, this.initialProps));
  }

  _mouseAction(event) {
    if (event.type != 'mouseleave') {
      $(`#${this.id}`).addClass('active-control');
    } else {
      $(`#${this.id}`).removeClass('active-control');
    }
  }
}
