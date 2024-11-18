import { InputFieldDisplayProps } from '../../config-properties/display-props/input-display-properties';
import {
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../../utils/control-props-types';
import { DatePickerDataProperties } from '../../config-properties/data-props/data-properties';
import { ELEMENT_TYPES } from '../../utils/element-types';
import InputElement from '../input-element';
import { DatePickerValidationProps } from '../../config-properties/validation-props/date-picker-validation-properties';
import { getDatepickerOptionsFromProps, getRelativeDateValue } from '../../../js/control-utils';
import { INPUT_TYPES } from '../../utils/input-types';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class DatePicker extends InputElement {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.DATE_PICKER_JQ);
    this.setup();
  }

  afterRender() {
    const props = this.getPropsObject();
    const datePickerOptions = getDatepickerOptionsFromProps(props);
    const control = this;
    $(this.getIdSelector())
      .datepicker({
        ...datePickerOptions,
      })
      .on('change', { control, props, datePickerOptions }, function (event) {
        const { control, props, datePickerOptions } = event.data;
        const date = $(this).datepicker('getDate');
        if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
          if (date) {
            $(control.getIdSelector() + '-end').datepicker('option', 'minDate', date);
          } else {
            $(control.getIdSelector() + '-end').datepicker('option', 'minDate', datePickerOptions?.minDate);
            $(control.getIdSelector() + '-end').datepicker('setDate', null);
          }
        }
      });
    if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
      $(this.getIdSelector() + '-end')
        .datepicker({
          ...datePickerOptions,
        })
        .on('change', { control, props, datePickerOptions }, function (event) {
          const { control, props, datePickerOptions } = event.data;
          const date = $(this).datepicker('getDate');
          if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
            if (date) {
              $(control.getIdSelector()).datepicker('option', 'maxDate', date);
            } else {
              $(control.getIdSelector()).datepicker('option', 'maxDate', datePickerOptions?.maxDate);
            }
          }
        });
    }
  }

  setup() {
    this.elementType = ELEMENT_TYPES.DATE_PICKER_JQ;
    this.type = ELEMENT_TYPES.INPUT;

    this.displayControlProps = new InputFieldDisplayProps(INPUT_TYPES.DATE, this.props);
    this.dataControlProps = new DatePickerDataProperties(this.props);
    this.validationControlProps = new DatePickerValidationProps(ELEMENT_TYPES.DATE_PICKER_JQ, this.props);
    this.attr['class'] = 'form-control';
  }

  modifyProps(props) {
    const values = {
      [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]: getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]),
      [CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]),
      [CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]),
    };
    Object.assign(props, values);
  }
}
