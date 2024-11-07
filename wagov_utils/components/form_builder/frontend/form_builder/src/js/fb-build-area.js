import { DropableControl } from '../controls/layout/dropable-control';
import { getControlFromToolbox } from '../controls/toolbox-store';
import { CONTROL_API_PROPS_TYPES } from '../controls/utils/control-props-types';
import { activateTooltips, camelCase, markup } from './utils';

export class BuildArea {
  static instance;

  areaId = 'root';

  dropables = {};

  constructor() {
    if (BuildArea.instance) {
      return BuildArea.instance;
    }

    BuildArea.instance = this;
    this.area = this.getDropableControl('diosito');
    this.setupDropableArea();
  }

  static getInstance() {
    if (!BuildArea.instance) {
      BuildArea.instance = new BuildArea();
    }
    return BuildArea.instance;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  setupDropableArea() {
    this.area.onDrop = function (control) {
      control.parentAreaId = this.areaId;
    };
    this.area.onRemove = function (control) {
      console.log('Remove event', control.controlType);
    };
  }

  transferControl(controlId, sourceAreaId, targetAreaId) {
    if (!this.dropables[sourceAreaId] || !this.dropables[targetAreaId]) {
      console.error('Invalid source or target area ID');
      return;
    }

    const control = this.dropables[sourceAreaId].getChildControl(controlId);
    if (control) {
      console.log('Transferring from', sourceAreaId, 'to', targetAreaId);
      this.dropables[targetAreaId].addChildControl(control);
      this.dropables[sourceAreaId].removeChildControl(controlId);
      console.log('Control transferred from', sourceAreaId, 'to', targetAreaId);
    }
  }

  getDropableControl(areaId, props = {}, attr = {}) {
    const _areaId = props.areaId || areaId;
    Object.assign(props, { areaId: _areaId });
    const dropable = new DropableControl(attr, props);

    this.registerDropable(_areaId, dropable);
    return dropable;
  }

  registerDropable(areaId, dropable) {
    if (!dropable.parentAreaId) dropable.parentAreaId = this.areaId;
    this.dropables[areaId] = dropable;
  }

  removeControl(control) {
    if (control.parentAreaId) {
      this.dropables[control.parentAreaId].removeChildControl(control.id);
    }
  }

  removeDropable(areaId) {
    if (this.dropables[areaId]) {
      console.log('Dropable removed', areaId);
      delete this.dropables[areaId];
    }
  }

  clearAreaContainer() {
    this.area.clearContainer();
  }

  setAreaContainer(area) {
    this.area.setContainer(area, true);
  }

  fieldNameExists(name) {
    let count = 0;
    const names = {};
    for (const key in this.dropables) {
      const dropable = this.dropables[key];
      for (const control of dropable.children) {
        names[control.props[CONTROL_API_PROPS_TYPES.FIELD_NAME]] = names[
          control.props[CONTROL_API_PROPS_TYPES.FIELD_NAME]
        ]
          ? names[control.props[CONTROL_API_PROPS_TYPES.FIELD_NAME]] + 1
          : 0;
        if (control.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] === name) {
          count++;
        }
      }
    }
    return count;
  }

  generateAPIFieldName(defaultName = 'unnamedField') {
    const name = camelCase(defaultName).toString().trim().replace(' ', '');
    const count = this.fieldNameExists(name);
    return count === 0 ? name : `${name}${count + 1}`;
  }

  toJSON() {
    return this.area.children.map((c) => c.toJSON());
  }

  viewForm(container) {
    if (!this.area) {
      throw new Error('No area defined');
    }

    if (!this.area.children.length) {
      container.append(markup('h1', 'Empty form', { class: 'text-center' }));
      return;
    }
    this.area.toDisplay(container);
    container.on('submit', this, (e) => {
      const _this = e.data;
      e.preventDefault();
      const isValid = _this.area.validateValue();
      if (isValid) {
        console.log('Form is valid');
        console.log(_this.area.getFieldValues());
      } else {
        console.log('Form is invalid');
      }
    });

    activateTooltips(container);
  }
}

export const instantiateJsonControl = (control, isCopy = false) => {
  const children = [];
  if (control.hasOwnProperty('children') && control.children.length > 0) {
    for (let i = 0; i < control.children.length; i++) {
      const child = control.children[i];
      children.push(instantiateJsonControl(child));
    }
  }
  const { attr, props, controlClass } = getControlFromToolbox(control?.elementType);

  if (!controlClass) throw new Error(`Control not found for type ${control?.elementType} in the toolbox`);

  const _attr = control?.attr ?? attr;
  const _props = control?.props ?? props;

  if (children.length) _props.children = children;

  const element = new controlClass(_attr, _props);
  return element;
};
