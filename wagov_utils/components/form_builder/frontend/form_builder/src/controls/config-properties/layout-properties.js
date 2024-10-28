import { generateRandomId } from '../../js/utils';
import { LAYOUT_CONTROL_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { BaseControlProps } from './base-control-props';

const columnsProps = [CONTROL_PROPS_TYPES.LABEL, LAYOUT_CONTROL_PROPS_TYPES.COLUMNS];
const HTMLComponentProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  LAYOUT_CONTROL_PROPS_TYPES.TAG,
  LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT,
];

export class ColumnsDisplayProps extends BaseControlProps {
  constructor(props) {
    super(columnsProps);
    this.fillInProps(props);
    if (props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]) {
      this.modifyPropValue(
        LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
        props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].map((col) => ({ ...col, id: ['row', generateRandomId()].join('-') })),
      );
    }
  }
}

export class HTMLComponentDisplayProps extends BaseControlProps {
  constructor(props) {
    super(HTMLComponentProps);
    this.fillInProps(props);
  }
}
