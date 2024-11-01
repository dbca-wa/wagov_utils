import { activateTooltips, generateRandomId, markup } from './utils';

export default class Control {
  id = '';
  parentAreaId;
  attr = {};

  props = {};

  className = '';

  controlType = 'BLOCK';
  elementType; // More specific, directly related to the class
  displayControlProps;
  dataControlProps;
  validationControlProps;
  apiControlProps;

  $p; // Parent element for rendering purposes

  constructor(attr, props, controlType, id = null) {
    this.controlType = controlType;
    this.attr = attr;
    this.props = props;
    this.events = {};
    if (!id && !this.id) {
      this.id = (this.controlType.toLocaleLowerCase() + '-' + generateRandomId()).toLowerCase();
    } else {
      this.id = id;
    }
  }

  setup() {
    console.log('Setup method called');
  }

  getIdSelector() {
    return `#${this.id}`;
  }

  setParent(parent) {
    this.$p = parent;
  }

  renderInParent(parent = null) {
    if (parent) this.setParent(parent);
    if (this.$p) this.$p.empty().append(this.renderControl());
    if (this.$p) {
      activateTooltips(this.$p);
    }
  }

  getPropsObject() {
    return {
      ...this.props,
      ...this.displayControlProps?.getPropsValues(),
      ...this.dataControlProps?.getPropsValues(),
      ...this.validationControlProps?.getPropsValues(),
      ...this.apiControlProps?.getPropsValues(),
    };
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      // attr: this.attr,
      props: this.getPropsObject(),
    };
    return json;
  }

  toDisplay(container) {
    container.append(this.renderControl(true));
    // TODO: Add Events
  }

  renderControl() {
    return this.render();
  }

  render(children = [], containerClass = '') {
    // Implement rendering logic here
    const container = markup('div', children, {
      id: this.id,
      class: containerClass ?? this.props.containerClass,
    });
    return container;
  }

  on(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event, handler) {
    if (!this.events[event]) return;

    const index = this.events[event].indexOf(handler);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  trigger(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach((handler) => handler(...args));
  }
}
