import { generateRandomId } from '../../../js/utils';
import { LAYOUT_CONTROL_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../../utils/control-props-types';
import { BaseControlProps } from '../base-control-props';
import { BaseDisplayProps } from '../data-props/base-display-props';

const columnsProps = [
  CONTROL_PROPS_TYPES.LABEL,
  LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION,
  LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
];
const HTMLComponentProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  LAYOUT_CONTROL_PROPS_TYPES.TAG,
  LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT,
];

export class DropableDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super([CONTROL_PROPS_TYPES.CUSTOM_CLASS, LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION]);
    this.fillInProps(props);
    if (props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]) {
      this.modifyPropValue(
        LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
        props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].map((col) => ({
          ...col,
          id: col.id ? col.id : ['row', generateRandomId()].join('-'),
        })),
      );
    }
  }
}
export class ContainerDisplayBlock extends BaseDisplayProps {
  constructor(props) {
    super([LAYOUT_CONTROL_PROPS_TYPES.TITLE]);
    this.fillInProps(props);
  }
}

export class ColumnsDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(columnsProps);
    this.fillInProps(props);
    if (props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]) {
      this.modifyPropValue(
        LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
        props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].map((col) => ({
          ...col,
          id: col.id ? col.id : ['row', generateRandomId()].join('-'),
        })),
      );
    }
  }
}

export class HTMLComponentDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(HTMLComponentProps);
    this.fillInProps(props);
  }
}
