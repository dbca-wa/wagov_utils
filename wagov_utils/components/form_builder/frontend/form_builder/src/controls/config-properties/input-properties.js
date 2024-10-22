import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { BaseControlProps } from './base-control-props';

const textProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  //   CONTROL_PROPS_TYPES.PREFIX,
  //   CONTROL_PROPS_TYPES.SUFFIX,
  //   CONTROL_PROPS_TYPES.TAB_INDEX,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const radioProps = [
  CONTROL_PROPS_TYPES.LABEL,
  //   CONTROL_PROPS_TYPES.TAB_INDEX,
  // CONTROL_PROPS_TYPES.CHECKED,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.DISABLED,
];

const checkboxProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  //   CONTROL_PROPS_TYPES.TAB_INDEX,
  // CONTROL_PROPS_TYPES.CHECKED,
  CONTROL_PROPS_TYPES.DISABLED,
];

const selectProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

function getProps(type) {
  switch (type) {
    case 'radio':
      return radioProps;
    case 'checkbox':
      return checkboxProps;
    default:
      return textProps;
  }
}

export class TextFieldDisplayProps extends BaseControlProps {
  constructor(props) {
    super(textProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class InputFieldDisplayProps extends BaseControlProps {
  constructor(type = 'text', props) {
    super(getProps(type));
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class RadioDisplayProps extends BaseControlProps {
  constructor(props) {
    super(radioProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class CheckboxDisplayProps extends BaseControlProps {
  constructor(props) {
    super(checkboxProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class SelectDisplayProps extends BaseControlProps {
  constructor(props) {
    super(selectProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}
