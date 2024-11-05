import { CONTROL_VALIDATION_PROPS_TYPES } from '../controls/utils/control-props-types';

export const runInputFieldValidations = (value, control) => {
  const validationProps = control.validationControlProps?.getPropsValues();
  const errors = [];
  const strValue = value?.toString() ?? '';
  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) {
    if ((typeof value === 'boolean' && !value) || value === null || strValue.length === 0) {
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
