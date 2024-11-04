import InputElement from './elements/input-element';
import SelectElement from './elements/select-element';
import { ELEMENT_TYPES } from './utils/element-types';
import RadioButton from './elements/radio-button';
import { INPUT_TYPES } from './utils/input-types';
import { LAYOUT_TYPES } from './utils/layout-types';
import { ColumnsBlock } from './layout/columns-block';
import TextAreaElement from './elements/textarea';
import SelectBoxes from './elements/select-boxes';
import { HTMLComponent } from './layout/html-component';
import ButtonElement from './elements/button-element';

export const CONTROLS_STORE = {
  [ELEMENT_TYPES.INPUT]: {
    description: 'A simple input control',
    props: {
      name: 'Input Control',
      label: 'Text Field',
      placeholder: '',
      required: true,
      type: INPUT_TYPES.TEXT,
      minWordLength: 1,
      maxWordLength: 2,
    },
    attr: {
      type: INPUT_TYPES.TEXT,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.MOBILE_NUMBER]: {
    description: 'A simple mobile number control',
    props: {
      name: 'Mobile Number',
      label: 'Mobile Number',
      placeholder: '',
      required: true,
      type: INPUT_TYPES.MOBILE_NUMBER,
    },
    attr: {
      type: INPUT_TYPES.MOBILE_NUMBER,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.INPUT_NUMBER]: {
    description: 'A simple number control',
    props: {
      name: 'Input Number',
      label: 'Enter a number',
      type: INPUT_TYPES.NUMBER,
      placeholder: 'Enter a number',
      required: true,
      minValue: 5,
    },

    attr: {
      type: INPUT_TYPES.NUMBER,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.SELECT]: {
    description: 'A simple select control',
    props: {
      name: 'Select Control',
      label: 'Select an option',
      required: true,
      values: [
        { text: 'Select Option 1', value: 'option1' },
        { text: 'Select Option 2', value: 'option2' },
      ],
    },
    attr: {
      type: INPUT_TYPES.SELECT,
    },
    icon: 'fa fa-font',
    controlClass: SelectElement,
  },
  [ELEMENT_TYPES.CHECK_BOX]: {
    description: 'A simple checkbox control',
    name: 'Checkbox Control',
    props: { label: 'Checkbox', type: INPUT_TYPES.CHECK_BOX },
    attr: {
      type: INPUT_TYPES.CHECK_BOX,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.SELECT_BOXES]: {
    description: 'A simple select boxes control',
    name: 'Select Boxes',
    props: {
      label: 'Select Boxes',
      type: INPUT_TYPES.SELECT_BOXES,
      values: [
        { text: 'Select Box 1', value: 'select-box-1' },
        { text: 'Select Box 2', value: 'select-box-2' },
      ],
    },
    attr: {
      type: INPUT_TYPES.SELECT_BOXES,
    },
    icon: 'fa fa-font',
    controlClass: SelectBoxes,
  },
  [ELEMENT_TYPES.RADIO]: {
    description: 'A simple radio control',
    props: {
      label: 'Radio',
      values: [
        { text: 'Option 1', value: 'opt-1' },
        { text: 'Option 2', value: 'opt-2' },
      ],
      labelClass: 'form-check-label',
    },
    name: 'Radio Control',
    attr: {},
    icon: 'fa fa-font',
    controlClass: RadioButton,
  },
};

export const SPECIAL_INPUT_STORE = {
  [ELEMENT_TYPES.DATE_PICKER]: {
    description: 'A simple date control',
    props: {
      name: 'Date Picker',
      label: 'Select a date',
      type: INPUT_TYPES.DATE,
      placeholder: 'Select a date',
      required: true,
    },
    attr: {
      type: INPUT_TYPES.DATE,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.TIME_PICKER]: {
    description: 'A simple time control',
    props: {
      name: 'Time Picker',
      label: 'Select a time',
      type: INPUT_TYPES.TIME,
      placeholder: 'Select a time',
      required: true,
    },
    attr: {
      type: INPUT_TYPES.TEXT,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.PASSWORD]: {
    description: 'A simple password control',
    props: {
      name: 'Password',
      label: 'Enter a password',
      type: INPUT_TYPES.PASSWORD,
      placeholder: 'Enter a password',
      required: true,
    },
    attr: {
      type: INPUT_TYPES.PASSWORD,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.EMAIL]: {
    description: 'A simple email control',
    props: {
      name: 'Email',
      label: 'Enter an email',
      type: INPUT_TYPES.EMAIL,
      placeholder: 'Enter an email',
      required: true,
    },
    attr: {
      // type: INPUT_TYPES.EMAIL,
    },
    icon: 'fa fa-font',
    controlClass: InputElement,
  },
  [ELEMENT_TYPES.TEXT_AREA]: {
    description: 'A simple text area control',
    props: {
      name: 'Text Area',
      label: 'Enter some text',
      type: INPUT_TYPES.TEXT_AREA,
      placeholder: 'Enter some text',
      required: true,
    },
    attr: {
      type: INPUT_TYPES.TEXT_AREA,
    },
    icon: 'fa fa-font',
    controlClass: TextAreaElement,
  },
  [ELEMENT_TYPES.BUTTON]: {
    description: 'A simple button control',
    props: {
      name: 'Button',
      label: 'Click me',
      size: 'btn-lg',
      blockButton: true,
      action: 'submit',
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: ButtonElement,
  },
};

export const LAYOUT_STORE = {
  [LAYOUT_TYPES.COLUMNS_ROW]: {
    description: 'A row with columns',
    props: {
      label: 'Columns displayed',
      columns: [
        {
          size: 'md',
          width: 6,
        },
        {
          size: 'md',
          width: 6,
        },
      ],
    },
    name: 'Columns',
    attr: {},
    icon: 'fa fa-font',
    controlClass: ColumnsBlock,
  },
  [LAYOUT_TYPES.HTML_CONTENT]: {
    description: 'A block of custom HTML code',
    props: {
      label: 'HTML',
      tag: 'p',
      htmlContent: 'Custom HTML',
    },
    name: 'HTML Component',
    attr: {},
    icon: 'fa fa-font',
    controlClass: HTMLComponent,
  },
};

export const BUILDER_TOOLBOX = Object.assign({}, CONTROLS_STORE, SPECIAL_INPUT_STORE, LAYOUT_STORE);
