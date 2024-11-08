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
    $(this.getIdSelector()).datepicker({
      ...getDatepickerOptionsFromProps(props),
    });
    $(this.getIdSelector()).trigger('click');
  }

  setup() {
    this.elementType = ELEMENT_TYPES.DATE_PICKER_JQ;
    this.type = ELEMENT_TYPES.INPUT;

    this.displayControlProps = new InputFieldDisplayProps(ELEMENT_TYPES.DATE_PICKER, this.props);
    this.dataControlProps = new DatePickerDataProperties(this.props);
    this.validationControlProps = new DatePickerValidationProps(ELEMENT_TYPES.DATE_PICKER, this.props);
    this.attr['class'] = 'form-control';
  }

  modifyProps(props) {
    console.log(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]);
    const values = {
      [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]: getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]),
      [CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]),
      [CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]),
    };
    Object.assign(props, values);
  }
}
