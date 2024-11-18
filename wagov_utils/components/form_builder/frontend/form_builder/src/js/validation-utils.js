import { CONTROL_VALIDATION_PROPS_TYPES, DATE_DATA_PROPS_TYPES } from '../controls/utils/control-props-types';
import { ELEMENT_TYPES } from '../controls/utils/element-types';

export const runInputFieldValidations = (value, control) => {
  const validationProps = control.getPropsObject();
  const errors = [];
  const strValue = value?.toString() ?? '';
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) {
    if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ && validationProps[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
      if (!value[0] || !value[1]) {
        errors.push('Please select a valid date range');
        return errors;
      } else if (value[0] && value[1] && value[0] > value[1]) {
        errors.push('Start date must be before end date');
        return errors;
      }
    } else if ((typeof value === 'boolean' && !value) || value === null || strValue.length === 0) {
      errors.push('This field is required');
      return errors;
    }
  }

  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH]) {
    if (strValue.length < validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH]) {
      errors.push(`Minimum length is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH]}`);
    }
  }
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH]) {
    if (strValue.length > validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH]) {
      errors.push(`Maximum length is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH]}`);
    }
  }
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH]) {
    const words = strValue.split(' ');
    if (words.length < validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH]) {
      errors.push(`Minimum words is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH]}`);
    }
  }
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH]) {
    const words = strValue.split(' ');
    if (words.length > validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH]) {
      errors.push(`Maximum words is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH]}`);
    }
  }
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED]) {
    if (value.length < validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED]) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED_ERROR_MESSAGE] ||
          `Minimum checked is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED]}`,
      );
    }
  }
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED]) {
    if (value.length > validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED]) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED_ERROR_MESSAGE] ||
          `Maximum checked is ${validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED]}`,
      );
    }
  }
  return errors;
};
