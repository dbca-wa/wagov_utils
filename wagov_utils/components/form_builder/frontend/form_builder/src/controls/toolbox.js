import { ELEMENT_TYPES } from './utils/element-types';
import { LAYOUT_TYPES } from './utils/layout-types';

export const FORM_CONTROLS = [
  { label: 'Input Text', type: ELEMENT_TYPES.INPUT },
  { label: 'Date Picker', type: ELEMENT_TYPES.DATE_PICKER },
  { label: 'Text Area', type: ELEMENT_TYPES.TEXT_AREA },
  // { label: 'Time Picker', type: ELEMENT_TYPES.TIME_PICKER },
  { label: 'Password', type: ELEMENT_TYPES.PASSWORD },
  { label: 'Email', type: ELEMENT_TYPES.EMAIL },
  { label: 'Select', type: ELEMENT_TYPES.SELECT },
  { label: 'Checkbox', type: ELEMENT_TYPES.CHECK_BOX },
  { label: 'Radio Button', type: ELEMENT_TYPES.RADIO },
  { label: 'Number', type: ELEMENT_TYPES.INPUT_NUMBER },
  { label: 'Columns', type: LAYOUT_TYPES.COLUMNS },
];
