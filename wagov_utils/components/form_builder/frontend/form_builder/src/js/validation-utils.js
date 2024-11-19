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

  const minTextLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH];
  if (minTextLength) {
    if (strValue.length < minTextLength) {
      errors.push(`Minimum length is ${minTextLength}`);
    }
  }
  const maxLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH];
  if (maxLength) {
    if (strValue.length > maxLength) {
      errors.push(`You have exceeded the maximum length: ${maxLength} characters`);
    }
  }
  const minWordLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH];
  if (minWordLength) {
    const words = strValue.split(' ');
    if (words.length < minWordLength) {
      errors.push(`Please, type at least ${minWordLength} word${minWordLength > 1 ? 's' : ''}`);
    }
  }
  const maxWordLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH];
  if (maxWordLength) {
    const words = strValue.split(' ');
    if (words.length > maxWordLength) {
      errors.push(`Please, use up to ${maxWordLength} word${maxWordLength > 1 ? 's' : ''}`);
    }
  }
  const minChecked = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED];
  if (minChecked) {
    if (value.length < minChecked) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED_ERROR_MESSAGE] ||
          `Please, select at least ${minChecked} option${minChecked > 1 ? 's' : ''}`,
      );
    }
  }
  const maxChecked = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED];
  if (maxChecked) {
    if (value.length > maxChecked) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED_ERROR_MESSAGE] ||
          `Select no more than ${maxChecked} option${maxChecked > 1 ? 's' : ''}`,
      );
    }
  }
  return errors;
};
