import { LAYOUT_CONTROL_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { BaseControlProps } from './base-control-props';

const columnsProps = [CONTROL_PROPS_TYPES.LABEL, LAYOUT_CONTROL_PROPS_TYPES.COLUMNS];

export class ColumnsDisplayProps extends BaseControlProps {
  constructor(props) {
    super(columnsProps);
    this.fillInProps(props);
  }
}
