import { DropableControl } from '../controls/layout/dropable-control';

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
      console.log('Drop event', control.controlType);
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
      this.dropables[targetAreaId].addChildControl(control);
      this.dropables[sourceAreaId].removeChildControl(controlId);
    }
  }

  getDropableControl(parentId) {
    const dropable = new DropableControl();
    dropable.areaId = parentId;

    dropable.parentAreaId = this.areaId;
    dropable.onDrop = function (control) {
      control.parentAreaId = this.areaId;
    };
    dropable.onRemove = (control) => {
      console.log('Remove event', control.controlType);
    };
    this.dropables[parentId] = dropable;
    return dropable;
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
}
