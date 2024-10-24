import { markup } from '../../js/utils';
import LayoutControl from '../fb-layout-control';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';

const defaultSettings = {};

export class Column extends LayoutControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);

    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.setup();
  }

  renderControl() {
    return this.render({
      ...this.props,
    });
  }

  render(customProps) {
    const props = customProps ?? this.props;

    return markup('div', '', { id: props.id, class: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] });
  }
}
