import { CONTROL_PROPS_TYPES } from '../../utils/control-props-types';

export const propertiesStore = {
  [CONTROL_PROPS_TYPES.LABEL]: {
    name: 'label',
    title: 'Label',
    type: 'string',
    placeholder: 'Enter a label',
    required: true,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: {
    name: 'placeholder',
    title: 'Placeholder',
    type: 'string',
    placeholder: 'Enter a placeholder',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: {
    name: 'customClass',
    title: 'Custom Class',
    type: 'string',
    placeholder: 'Custom CSS classes',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.DESCRIPTION]: {
    name: 'description',
    title: 'Description',
    type: 'string',
    placeholder: 'Enter a description',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.TOOLTIP]: {
    name: 'tooltip',
    title: 'Tooltip',
    type: 'string',
    placeholder: 'Enter a tooltip',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.PREFIX]: {
    name: 'prefix',
    title: 'Prefix',
    type: 'string',
    placeholder: 'Enter a prefix',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.SUFFIX]: {
    name: 'suffix',
    title: 'Suffix',
    type: 'string',
    placeholder: 'Enter a suffix',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.TAB_INDEX]: {
    name: 'tabIndex',
    title: 'Tab Index',
    type: 'number',
    placeholder: 'Enter a tabIndex',
    required: false,
    options: undefined,
    value: '',
  },
  [CONTROL_PROPS_TYPES.HIDDEN]: {
    name: 'hidden',
    title: 'Hidden',
    type: 'boolean',
    placeholder: 'Enter a hidden',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_PROPS_TYPES.DISABLED]: {
    name: 'disabled',
    title: 'Disabled',
    type: 'boolean',
    placeholder: 'Enter a disabled',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_PROPS_TYPES.HIDE_LABEL]: {
    name: 'hideLabel',
    title: 'Hide Label',
    type: 'boolean',
    placeholder: 'Enter a hideLabel',
    required: false,
    options: undefined,
    value: false,
  },
  [CONTROL_PROPS_TYPES.CHECKED]: {
    name: 'checked',
    title: 'Checked',
    type: 'boolean',
    placeholder: 'Enter a checked',
    required: false,
    options: undefined,
    value: false,
  },
};
