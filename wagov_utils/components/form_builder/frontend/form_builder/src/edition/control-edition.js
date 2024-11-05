import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from '../controls/utils/control-props-types';
import { CONTROL_TYPES } from '../controls/utils/control-types';
import Control from '../js/fb-control';
import { appSelectors } from '../js/selectors';
import { activateTooltips, compareMinMaxIntegers, generateRandomId, markup } from '../js/utils';
import controlWrapperTemplate from '../views/control-edition/control-edition-wrapper.handlebars';
import Modal from 'bootstrap/js/dist/modal.js';

export default class ControlEdition extends Control {
  id = 'element-wrapper-' + generateRandomId();
  modal = null;
  initialProps;
  hasSaved = false;
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
  }

  _editControl(event) {
    const _this = event.data;
    _this.hasSaved = false;
    const modalIdSelector = `#${appSelectors.modalControlEdition}`;
    const $m = $(modalIdSelector);

    if (_this.control && _this.control.displayControlProps) {
      _this.control.dataControlProps?.setEditor($m.find('#data-tab-pane form'), _this);
      _this.control.validationControlProps?.setEditor($m.find('#validation-tab-pane form'), _this);
      _this.control.apiControlProps?.setEditor($m.find('#api-tab-pane form'), _this);
      $m.find('#display-tab-pane form').empty().append(_this.control.displayControlProps.render());
      _this.control.dataControlProps?.renderInParent();
      _this.control.validationControlProps?.renderInParent();
      _this.control.apiControlProps?.renderInParent();
      _this.control.displayControlProps.addChangeEvents(_this, _this._onPropsChange);

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

  _onPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e.value;
    _this.control.displayControlProps.modifyPropValue(prop.name, value);
    _this._renderPreviewControl();
  }

  _renderPreviewControl() {
    const props = {
      ...this.control.displayControlProps.getPropsValues(),
      ...this.control.dataControlProps?.getPropsValues(),
      ...this.control.validationControlProps?.getPropsValues(),
      ...this.control.apiControlProps?.getPropsValues(),
    };
    $('#preview-edition').empty().append(this.control.render(props));
    activateTooltips(document, '#preview-edition');
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) {
      $('#preview-edition ' + this.control.getIdSelector()).mask(props[CONTROL_PROPS_TYPES.DISPLAY_MASK]);
    }
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
    }
    if (!props[CONTROL_API_PROPS_TYPES.FIELD_NAME]) {
      alert('Field name is required');
      $('#api-tab').trigger('click');
      return;
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
