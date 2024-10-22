import { ELEMENT_TYPES } from './utils/element-types';
import { LAYOUT_TYPES } from './utils/layout-types';

export const FORM_CONTROLS = [
  { label: 'Input Text', type: ELEMENT_TYPES.INPUT },
  { label: 'Select', type: ELEMENT_TYPES.SELECT },
  { label: 'Checkbox', type: ELEMENT_TYPES.CHECK_BOX },
  { label: 'Radio Button', type: ELEMENT_TYPES.RADIO },
  { label: 'Number', type: ELEMENT_TYPES.INPUT_NUMBER },
  { label: 'Columns', type: LAYOUT_TYPES.COLUMNS },
];
