import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { BasicAPIProps } from '../config-properties/api-props/basic-api-properties';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import { CONTROL_API_PROPS_TYPES, CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { RowBlock } from './row-block';

const defaultSettings = {
  columns: [
    {
      size: 'lg',
      width: 12,
    },
  ],
};

export class EditableGrid extends RowBlock {
  elementType = LAYOUT_TYPES.EDIT_GRID;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
  }

  setup() {
    this.dropableType = LAYOUT_TYPES.EDIT_DROPABLE;
    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      BuildArea.getInstance().generateAPIFieldName(this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? this.type);

    this.displayControlProps = new ColumnsDisplayProps(this.props);
    this.apiControlProps = new BasicAPIProps(LAYOUT_TYPES.EDIT_DROPABLE, this.props);
    this.dataControlProps = null;

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
    this.children.forEach((child) => {
      child.props[LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION] = 'row';
      child.displayControlProps.modifyPropValue(LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION, 'row');
    });
  }

  render(customProps, includeDropables = false) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const nodes = [];
    const label = props[CONTROL_PROPS_TYPES.LABEL];
    if (label) {
      nodes.push(markup('label', label, { for: this.id }));
    }
    return markup('div', [...nodes, super.render(customProps, includeDropables)], {});
  }

  getFieldValues() {
    const props = this.getPropsObject();
    if (!props[CONTROL_API_PROPS_TYPES.FIELD_NAME] || !this.children.length) return {};
    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: this.children[0].getFieldValues(),
    };
  }
}
