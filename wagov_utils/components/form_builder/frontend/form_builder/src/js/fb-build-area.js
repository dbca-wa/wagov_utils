import { DropableControl } from '../controls/layout/dropable-control';
import { markup } from './utils';

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

  getDropableControl(parentId) {
    const dropable = new DropableControl();
    dropable.areaId = parentId;

    dropable.parentAreaId = this.areaId;

    this.dropables[parentId] = dropable;
    return dropable;
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

  setAreaContainer(area) {
    this.area.setContainer(area, true);
  }

  toJSON() {
    return this.area.children.map((c) => c.toJSON());
  }

  viewForm(container) {
    if (!this.area) {
      throw new Error('No area defined');
    }

    if (!this.area.children.length) {
      container.append(markup('h1', 'Nada por aquí'));
      return;
    }
    this.area.toDisplay(container);
  }
}
