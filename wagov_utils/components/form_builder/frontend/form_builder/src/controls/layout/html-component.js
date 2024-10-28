import Control from '../../js/fb-control';
import { markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { HTMLComponentDisplayProps } from '../config-properties/layout-properties';
import { CONTROL_TYPES } from '../utils/control-types';
import Label from '../elements/basics/label';
import { BasicDataProperties } from '../config-properties/data-properties';

const defaultSettings = {
  tag: 'div',
};

export class HTMLComponent extends Control {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);

    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.label = new Label(props['label']); // Default label

    this.setup();
  }
  setup() {
    this.container_class = this.props?.container_class || 'html-block';
    this.displayControlProps = new HTMLComponentDisplayProps(this.props);
    this.dataControlProps = new BasicDataProperties(this.props);
  }
  renderControl() {
    const props = this.displayControlProps.getPropsValues();
    Object.assign(props, this.dataControlProps.getPropsValues());

    return this.render({
      [CONTROL_PROPS_TYPES.LABEL]: props[CONTROL_PROPS_TYPES.LABEL] ?? '',
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
      [LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT]: props[LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT] ?? '',
      [LAYOUT_CONTROL_PROPS_TYPES.TAG]: props[LAYOUT_CONTROL_PROPS_TYPES.TAG] ?? '',
    });
  }

  render(customProps) {
    const props = customProps ?? this.props;

    const content =
      props[LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT] ?? this.props[LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT];
    const tag = props[LAYOUT_CONTROL_PROPS_TYPES.TAG] ?? this.props[LAYOUT_CONTROL_PROPS_TYPES.TAG];

    const elements = [];
    if (tag) {
      elements.push(markup(tag, '', { class: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] }));
    }
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(content, 'text/html');
      elements.push(...htmlDoc.body.childNodes);
    } catch (error) {
      console.log(error);
    }

    return markup('div', elements, { id: props.id });
  }
}
