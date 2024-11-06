import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import LayoutControl from '../fb-layout-control';
import { CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { Column } from './column';

const defaultSettings = {
  values: [],
};

export class RowBlock extends LayoutControl {
  elementType = LAYOUT_TYPES.ROW_COLUMNS;
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.setup();
  }

  setup() {
    this.container_class = 'row';
    let children = this.props?.children || [];

    this.displayControlProps = new ColumnsDisplayProps(this.props);
    this.dataControlProps = null;
    const props = this.displayControlProps.getPropsValues();

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const { id, size, width } = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      if (children.length > i) {
        const colData = children[i];
        const dropable = BuildArea.getInstance().getDropableControl(this.areaId, {
          props: {
            id: id,
            [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col-${size}-${width}`,
            ...colData.props,
          },
        });

        this.children.push(dropable);
      } else {
        const dropable = BuildArea.getInstance().getDropableControl(this.areaId, {
          id,
          areaId: id,
          [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col-${size}-${width}`,
        });
        this.children.push(dropable);
      }
    }
  }

  renderInParent(parent = null) {
    if (parent) this.setParent(parent);
    if (this.$p) {
      this.$p.empty().append(this.renderControl());
      for (let i = 0; i < this.children.length; i++) {
        const colData = this.children[i];
        // const node = colData.renderControl();
        // nodes.push(node);
        colData.setContainer(this.$p.find(this.getIdSelector()), true);
        // if (includeDropables && colData.children.length > 0) {
        // }
      }
    }
  }

  toDisplay(container) {
    const parent = markup('div', '', { class: this.container_class, id: this.id });
    container.append(parent);
    for (let i = 0; i < this.children.length; i++) {
      const column = this.children[i];
      column.toDisplay(parent);
    }
  }

  renderControl(isDisplayMode = false) {
    const _this = this;
    const props = _this.displayControlProps.getPropsValues();
    const existingDropableIds = [..._this.children.map((child) => child.id)];
    const tmpchildren = [];

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const { id, size, width } = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      const dropable = _this.children.find((child) => child.id === id);
      if (dropable) {
        dropable.displayControlProps.modifyPropValue(CONTROL_PROPS_TYPES.CUSTOM_CLASS, `col-${size}-${width}`);
        tmpchildren.push(dropable);
        existingDropableIds.splice(existingDropableIds.indexOf(id), 1);
      } else {
        const dropable = BuildArea.getInstance().getDropableControl(_this.areaId, {
          props: {
            id: id,
            [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col-${size}-${width}`,
          },
        });
        tmpchildren.push(dropable);
      }
    }
    _this.children = tmpchildren;
    existingDropableIds.forEach((id) => {
      BuildArea.getInstance().removeDropable(id);
    });

    return this.render(props, true);
  }

  render(customProps, includeDropables = false) {
    const nodes = [];

    return markup('div', nodes, { class: this.container_class, id: this.id });
  }
}
