import { generateRandomId, markup } from './utils';

export default class Control {
  id = '';

  attr = {};

  props = {};

  className = '';

  controlType = 'BLOCK';
  displayControlProps;
  dataControlProps;

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

  renderControl(children = [], containerClass = '') {
    return markup('div', children, { class: containerClass });
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
