import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/layout-properties';
import LayoutControl from '../layout-setup';
import { LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';

const defaultSettings = {
  values: [],
};

export class ColumnsBlock extends LayoutControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);

    this.setup();
  }

  setup() {
    this.container_class = 'row';
    this.displayControlProps = new ColumnsDisplayProps(this.props);
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    return this.render(props);
  }

  render(customProps, attr) {
    const columns = customProps[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS] ?? [];
    const children = [];
    for (let i = 0; i < columns.length; i++) {
      const className = `col-${columns[i]['size']}-${columns[i]['width']}`;
      children.push(markup('div', '', { class: className }));
    }
    return super.render(children);
  }
}
