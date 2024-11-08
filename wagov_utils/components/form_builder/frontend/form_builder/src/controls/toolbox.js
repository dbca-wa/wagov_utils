import { ELEMENT_TYPES } from './utils/element-types';
import { LAYOUT_TYPES } from './utils/layout-types';

export const FORM_CONTROLS = [
  { label: 'Input Text', type: ELEMENT_TYPES.INPUT, icon: 'bi bi-type' },
  { label: 'Date Picker V2', type: ELEMENT_TYPES.DATE_PICKER_JQ, icon: 'bi bi-calendar-date' },
  { label: 'Columns', type: LAYOUT_TYPES.ROW_COLUMNS, icon: 'bi bi-layout-three-columns' },
  { label: 'Container', type: LAYOUT_TYPES.CONTAINER, icon: 'bi bi-layout-three-columns' },
  { label: 'Mobile Number', type: ELEMENT_TYPES.MOBILE_NUMBER, icon: 'bi bi-phone' },
  { label: 'HTML', type: LAYOUT_TYPES.HTML_CONTENT, icon: 'bi bi-code' },
  { label: 'Text Area', type: ELEMENT_TYPES.TEXT_AREA, icon: 'bi bi-alphabet' },
  // { label: 'Time Picker', type: ELEMENT_TYPES.TIME_PICKER , icon: 'bi bi-'},
  { label: 'Password', type: ELEMENT_TYPES.PASSWORD, icon: 'bi bi-key-fill' },
  { label: 'Email', type: ELEMENT_TYPES.EMAIL, icon: 'bi bi-at' },
  { label: 'Select', type: ELEMENT_TYPES.SELECT, icon: 'bi bi-justify' },
  { label: 'Checkbox', type: ELEMENT_TYPES.CHECK_BOX, icon: 'bi bi-check-square' },
  { label: 'Select Boxes', type: ELEMENT_TYPES.SELECT_BOXES, icon: 'bi bi-ui-checks' },
  { label: 'Radio Button', type: ELEMENT_TYPES.RADIO, icon: 'bi bi-ui-radios' },
  { label: 'Number', type: ELEMENT_TYPES.INPUT_NUMBER, icon: 'bi bi-hash' },
  { label: 'Button', type: ELEMENT_TYPES.BUTTON, icon: 'bi bi-cursor-fill' },
];
