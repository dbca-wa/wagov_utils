import { Tooltip } from 'bootstrap';
import { CONTROL_PROPS_TYPES } from '../controls/utils/control-props-types';
import { CONTROL_TYPES } from '../controls/utils/control-types';
import Control from '../js/fb-control';
import { appSelectors } from '../js/selectors';
import { generateRandomId, markup } from '../js/utils';
import controlWrapperTemplate from '../views/control-edition/control-edition-wrapper.handlebars';
import displayBlockTemplate from '../views/control-edition/display-block.handlebars';
import Modal from 'bootstrap/js/dist/modal.js';

export default class ControlEdition extends Control {
  id = 'element-wrapper-' + generateRandomId();
  modal = null;
  initialProps;
  constructor(control, controller) {
    super({}, {}, CONTROL_TYPES.BLOCK);
    this.control = control;
    this.controller = controller;
    // if (control.element_type === 'select') {
    //   this._editControl({
    //     data: this,
    //   });
    // }
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
    const modalIdSelector = `#${appSelectors.modalControlEdition}`;
    const $m = $(modalIdSelector);

    if (_this.control && _this.control.displayControlProps) {
      _this.control.dataControlProps.setEditor($m.find('#data-tab-pane form'), _this);
      $m.find('#display-tab-pane form').empty().append(_this.control.displayControlProps.render());
      _this.control.dataControlProps.renderInParent();
      _this.control.displayControlProps.addChangeEvents(_this, _this._onPropsChange);

      _this.initialProps = {
        ..._this.control.displayControlProps.getPropsValues(),
        ..._this.control.dataControlProps?.getPropsValues(),
      };
      _this._renderPreviewControl();

      $('#display-tab').trigger('click');
      $('#data-tab').show();
      if (Object.keys(_this.control.dataControlProps.props).length === 0) $('#data-tab').hide();
    }

    _this.modal = new Modal(document.querySelector(modalIdSelector), {
      keyboard: true,
      backdrop: true,
    });
    _this.modal.toggle();

    console.log('Adding Control values');
    $m.find('.modal-footer .btn-primary').off('click').on('click', _this, _this._saveControl);
  }

  _onPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e.value;
    _this.initialProps[prop.name] = value;
    _this._renderPreviewControl();
  }

  _renderPreviewControl() {
    $('#preview-edition').empty().append(this.control.render(this.initialProps));

    const tooltipTriggerList = document.querySelectorAll('#preview-edition [data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  }

  _saveControl(event) {
    const _this = event.data;
    if (_this.initialProps[CONTROL_PROPS_TYPES.LABEL] === '') {
      alert('Label is required');
      return;
    }
    _this.control.displayControlProps.fillInProps(Object.assign({}, _this.initialProps));
    _this.control.dataControlProps.fillInProps(Object.assign({}, _this.initialProps));
    _this.modal.hide();
    _this.controller.onSave(_this);
  }

  _removeControl(event) {
    const _this = event.data;
    $(_this.getIdSelector()).fadeOut('fast', () => {
      $(_this.getIdSelector()).remove();
    });
  }

  _mouseAction(event) {
    if (event.type != 'mouseleave') {
      $(`#${this.id}`).addClass('active-control');
    } else {
      $(`#${this.id}`).removeClass('active-control');
    }
  }
}
