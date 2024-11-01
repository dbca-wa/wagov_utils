import { CONTROL_VALIDATION_PROPS_TYPES } from '../../utils/control-props-types';
import { BaseControlProps } from '../base-control-props';

const textProps = [
  CONTROL_VALIDATION_PROPS_TYPES.REQUIRED,
  CONTROL_VALIDATION_PROPS_TYPES.UNIQUE,
  CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_HIDDEN,
  CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH,
  CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH,
  CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE,

  CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE,
  CONTROL_VALIDATION_PROPS_TYPES.REGEX,
  CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE,
];

export class TextFieldValidationProps extends BaseControlProps {
  constructor(props) {
    super(textProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}
