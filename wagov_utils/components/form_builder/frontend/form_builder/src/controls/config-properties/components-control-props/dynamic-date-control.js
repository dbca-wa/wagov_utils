import { markup } from '../../../js/utils';
import { DATE_CONTROL_PROP_TYPES, RELATIVE_DATE_TYPES } from '../../utils/constants';
import { _renderProp } from '../control-prop';

export class DynamicDateControl {
  id;
  sortable = false;
  changeHandler;

  fixedRadioId;
  relativeRadioId;
  valueType;
  valueDate;
  dynamicValue;

  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.value = props.value;

    this.mainButtonsName = this.id + '-' + this.name;
    this.relativeButtonsName = this.id + '-' + this.name + '-relative';

    this.setup();
  }

  setup() {
    this.fixedRadioId = this.id + '-fixed';
    this.relativeRadioId = this.id + '-relative';
  }

  addChangeEventHandler({ fn, context }) {
    this.changeHandler = {
      fn,
      context,
    };

    $(`#${this.id} input[type="radio"][name="${this.mainButtonsName}"]`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      _this.handleDateTypeChange(value);
    });
    $(`#${this.id} input[type="radio"][name="${this.relativeButtonsName}"]`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      //   _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value });
      _this.handleRelativeDateChange(value);
    });

    $(`#${this.fixedRadioId}-render input`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      _this.valueDate = value;
      _this.changeHandler.fn({
        data: { ..._this.changeHandler.context },
        value: {
          type: this.valueType,
          date: value,
        },
      });
    });
  }

  handleDateTypeChange(value) {
    this.valueType = value;
    if (value === DATE_CONTROL_PROP_TYPES.FIXED) {
      $(`#${this.fixedRadioId}-render`).show();
      $(`#${this.relativeRadioId}-render`).hide();

      if (this.valueDate) {
        $(`#${this.fixedRadioId}-render input`).trigger('change');
      }
    } else {
      $(`#${this.fixedRadioId}-render`).hide();
      $(`#${this.relativeRadioId}-render`).show();
    }
  }
  handleRelativeDateChange(value) {
    if (value != RELATIVE_DATE_TYPES.CONDITION) {
      this.changeHandler.fn({
        data: { ...this.changeHandler.context },
        value: {
          type: this.valueType,
          relative: value,
        },
      });
      return;
    }

    // this.changeHandler.fn({ data: { ...this.changeHandler.context }, value });
  }

  renderFixed() {
    return markup('div', [
      markup('input', '', {
        type: 'date',
        class: 'form-control',
      }),
    ]);
  }

  renderRelative() {
    const name = this.relativeButtonsName;
    const types = [RELATIVE_DATE_TYPES.TODAY, RELATIVE_DATE_TYPES.YESTERDAY, RELATIVE_DATE_TYPES.TOMORROW];
    const elements = [];
    for (let relType in types) {
      elements.push(
        renderRadioButton({
          id: this.id + '-relative-' + relType,
          name: name,
          value: types[relType],
          label: `${types[relType]}`,
          isInline: true,
        }),
      );
    }

    return markup('div', elements);
  }

  addInputElementChange(selector, eventType) {
    $(selector).on(eventType, this, (e) => {
      e.preventDefault();

      const _this = e.data;
      _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value: _this.extractData() });
    });
  }

  render() {
    const dateElement = markup('div', '', { id: this.id, class: '' });
    const name = this.mainButtonsName;

    const buttonFixed = renderRadioButton(
      {
        id: this.fixedRadioId,
        name: name,
        value: DATE_CONTROL_PROP_TYPES.FIXED,
        label: 'Fixed',
      },
      () => {
        return this.renderFixed();
      },
    );
    const buttonRelative = renderRadioButton(
      {
        id: this.relativeRadioId,
        name: name,
        value: DATE_CONTROL_PROP_TYPES.RELATIVE,
        label: 'Relative',
      },
      () => {
        return this.renderRelative();
      },
    );

    dateElement.append(buttonFixed);
    dateElement.append(buttonRelative);

    return dateElement;
  }
}

const renderRadioButton = (radioOptions, optionContent) => {
  const { id, name, value, label, isInline, data } = radioOptions;

  return markup(
    'div',
    [
      {
        tag: 'input',
        type: 'radio',
        id: id,
        name: name,
        value: value,
        class: 'form-check-input',
        ...data,
      },
      { tag: 'label', for: id, content: label, class: 'form-check-label' },
      {
        tag: 'div',
        id: id + '-render',
        content: optionContent ? optionContent() : '',
        style: 'display: none;',
      },
    ],
    { class: ['form-check', isInline ? 'form-check form-check-inline' : ''].join(' ') },
  );
};
