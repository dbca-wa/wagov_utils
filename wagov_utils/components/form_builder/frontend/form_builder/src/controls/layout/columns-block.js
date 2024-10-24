import { BuildArea } from '../../js/fb-build-area';
import { ColumnsDisplayProps } from '../config-properties/layout-properties';
import LayoutControl from '../fb-layout-control';
import { CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';
import { Column } from './column';

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
    const props = this.displayControlProps.getPropsValues();

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const colData = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      this.dropables[colData.id] = BuildArea.getInstance().getDropableControl(colData.id);
    }
  }

  renderInParent(parent = null) {
    if (parent) this.setParent(parent);
    if (this.$p) {
      this.$p.empty().append(this.renderControl());
      for (const key in this.dropables) {
        this.dropables[key].renderInContainer();
      }
    }
  }

  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    const tempDropables = {};
    this.children = [];

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const colData = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      if (this.dropables[colData.id]) {
        tempDropables[colData.id] = this.dropables[colData.id];
        delete this.dropables[colData.id];
      } else {
        tempDropables[colData.id] = BuildArea.getInstance().getDropableControl(colData.id);
      }
      const col = new Column(
        {},
        {
          [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col-${colData['size']}-${colData['width']}`,
        },
      );
      col.children.push(tempDropables[colData.id]);
      this.children.push(col);
    }
    Object.keys(this.dropables).forEach((key) => {
      BuildArea.getInstance().removeDropable(key);
    });

    this.dropables = tempDropables;

    return this.render(props, true);
  }

  render(customProps, includeDropables = false) {
    const nodes = [];
    for (let i = 0; i < this.children.length; i++) {
      const colData = this.children[i];
      const node = colData.renderControl();
      nodes.push(node);
      if (includeDropables && colData.children.length > 0) {
        colData.children[0].setContainer($(node));
      }
    }
    return super.render(nodes);
  }
}
