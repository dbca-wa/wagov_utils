import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
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

export class ContainerBlock extends RowBlock {
  elementType = LAYOUT_TYPES.CONTAINER;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
  }

  setup() {
    this.displayControlProps = new ColumnsDisplayProps(this.props);
    this.dataControlProps = null;

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
  }
}
