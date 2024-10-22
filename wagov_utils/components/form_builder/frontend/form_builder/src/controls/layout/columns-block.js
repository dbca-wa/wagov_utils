import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/layout-properties';
import LayoutControl from '../layout-setup';
import { LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';
import { DropableBlock } from './dropable-control';

const defaultSettings = {
  values: [],
};

export class ColumnsBlock extends LayoutControl {
  dropables = {};

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.setup();
  }

  setup() {
    this.container_class = 'row';
    this.displayControlProps = new ColumnsDisplayProps(this.props);
    const props = this.displayControlProps.getPropsValues();

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const colData = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      this.dropables[colData.id] = new DropableBlock();
    }
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    const tempDropables = {};
    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const colData = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      if (this.dropables[colData.id]) {
        tempDropables[colData.id] = this.dropables[colData.id];
      } else {
        tempDropables[colData.id] = new DropableBlock();
      }
    }
    this.dropables = tempDropables;

    return this.render(props, true);
  }

  render(customProps, includeDropables = false) {
    const columns = customProps[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS] ?? [];
    const children = [];
    for (let i = 0; i < columns.length; i++) {
      const colData = columns[i];

      const className = `col-${colData['size']}-${colData['width']}`;
      children.push(markup('div', '', { class: className }));
      if (includeDropables) {
        this.dropables[colData.id].setContainer($(children[i]));
      }
    }
    return super.render(children);
  }
}
