import { DropableControl } from './dropable-control';
import { markup } from '../../js/utils';
import { MultiControlRenderer } from '../renderers/multivalue-renderer';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { LAYOUT_TYPES } from '../utils/layout-types';

const defaultSettings = {};

export class EditableDropableControl extends DropableControl {
  constructor(attr = {}, props = {}) {
    super(attr, props);
    this.elementType = LAYOUT_TYPES.EDIT_DROPABLE;
  }

  addChildControl(control) {
    super.addChildControl(control);
  }

  removeChildControl(controlId) {
    super.removeChildControl(controlId);

    // re set rows
  }

  validateValue() {
    let isValid = true;

    return isValid;
  }

  getFieldValues() {
    debugger;
    const values = {};
    if (this.renderer) {
      return this.renderer.getValues();
    }
    return values;
  }

  toDisplay(parentContainer) {
    const props = this.displayControlProps.getPropsValues();

    const container = markup('div', this.dropableType, {
      class: [props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] || 'col', 'row', 'my-3'].join(' '),
      id: this.id,
      'data-parentAreaId': this.parentAreaId,
      'data-areaId': this.areaId,
    });
    if (parentContainer) {
      parentContainer.append(container);
      this.renderer = new MultiControlRenderer(this, this.children);
      parentContainer.append(this.renderer.render());
      this.renderer.afterRender();
    }

    return container;
  }
}
