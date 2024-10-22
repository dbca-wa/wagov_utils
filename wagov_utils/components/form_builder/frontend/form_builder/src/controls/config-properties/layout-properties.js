import { generateRandomId } from '../../js/utils';
import { LAYOUT_CONTROL_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { BaseControlProps } from './base-control-props';

const columnsProps = [CONTROL_PROPS_TYPES.LABEL, LAYOUT_CONTROL_PROPS_TYPES.COLUMNS];

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
