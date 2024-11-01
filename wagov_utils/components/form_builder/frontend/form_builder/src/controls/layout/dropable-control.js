import ControlEdition from '../../edition/control-edition';
import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import LayoutControl from '../fb-layout-control';
import { BUILDER_TOOLBOX } from '../toolbox-store';
import { CLASS_DROPABLE_BLOCKS, CLASS_EMPTY_DROPABLE } from '../utils/constants';
import { LAYOUT_TYPES } from '../utils/layout-types';

const defaultSettings = {};

export class DropableControl extends LayoutControl {
  elementType = LAYOUT_TYPES.DROPABLE;
  $c;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
    this.area = BuildArea.getInstance();
    this.setup();
  }

  setup() {
    this.container_class = CLASS_DROPABLE_BLOCKS;
    this.displayControlProps = new ColumnsDisplayProps(this.props);
  }

  setContainer(container, render = false) {
    container.append(
      markup('div', '', {
        class: this.container_class,
        id: this.id,
        'data-parentAreaId': this.parentAreaId,
        'data-areaId': this.areaId,
      }),
    );
    this.$c = container.find(`.${this.container_class}`);
    if (render) this.renderInContainer();
  }

  getChildControl(controlId) {
    return this.children.find((c) => c.id === controlId);
  }

  reOrderChildControl(controlId) {
    const control = this.getChildControl(controlId);
    if (control) {
      this.children.sort((a, b) => {
        const aTop = $(`#${a.id}`).closest('.form-field').offset().top;
        const bTop = $(`#${b.id}`).closest('.form-field').offset().top;
        return aTop - bTop;
      });
    }
  }

  addChildControl(control) {
    const nodePosition = $(`#${control.id}`).closest('.form-field').offset().top;
    let i = 0;
    for (i = 0; i < this.children.length; i++) {
      const childPosition = $(`#${this.children[i].id}`)?.closest('.form-field').offset().top;
      if (childPosition && childPosition > nodePosition) break;
    }
    control.parentAreaId = this.areaId;
    this.children.splice(i, 0, control);
    this.toggleEmptyDropableControl();
  }

  removeChildControl(controlId) {
    const index = this.children.findIndex((c) => c.id === controlId);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    this.toggleEmptyDropableControl();
  }

  renderInContainer() {
    if (this.$c) {
      this.$c.empty();
      this.render();

      this.$c.sortable({
        helper: 'clone',
        cursor: 'move',
        scroll: false,
        handle: '.fb-wrapper-content',

        tolerance: 'pointer',
        placeholder: 'ui-state-highlight',
        cancel: `.${CLASS_EMPTY_DROPABLE}`,
        connectWith: `.${this.container_class}`,
      });
      this.$c.on('sortupdate', this, function (event, ui) {
        const _this = event.data;
        if (!ui.sender) {
          const { areaId: sourceAreaId } = this.dataset;
          const { controlId } = ui.item[0].dataset;
          _this.reOrderChildControl(controlId);
          return;
        }
        if (ui.sender.hasClass(CLASS_DROPABLE_BLOCKS) || this !== event.target) return;
        const nodeOffset = ui.item.offset().top;
        ui.sender.sortable('cancel');
        try {
          const data = ui.item[0].dataset;
          const controlType = data.controlType;
          const { attr, props, controlClass } = BUILDER_TOOLBOX[controlType];
          const elm = new controlClass(attr, props);
          if (_this.children.length === 0) {
            _this.$c.empty();
          }
          _this.addControl(this, elm, nodeOffset);
        } catch (error) {
          console.log("Couldn't append element", error);
        }
      });

      this.$c.on('sortreceive', this, function (event, ui) {
        const _this = event.data;
        if (!ui.sender || !ui.sender.hasClass(CLASS_DROPABLE_BLOCKS)) return;
        if (_this.$c[0].id === ui.sender[0].id) return;

        const { areaId: sourceAreaId } = ui.sender[0].dataset;
        const { areaId: targetAreaId } = _this.$c[0].dataset;
        const { controlId } = ui.item[0].dataset;
        _this.area.transferControl(controlId, sourceAreaId, targetAreaId);
      });
    }
  }

  toggleEmptyDropableControl() {
    if (this.children.length === 0) {
      this.$c.append(emptyDropableControl.cloneNode(true));
    } else {
      document.querySelector(`#${this.id}> .${CLASS_EMPTY_DROPABLE}`)?.remove();
    }
  }

  addControl(areaContainer, control, nodeOffset = null) {
    this.insertControl(areaContainer, control, nodeOffset);
    this.addChildControl(control);
    this.onDrop(control);
  }

  onDrop(control) {
    console.log('Control dropped on ' + this.areaId, control.controlType);
    control.parentAreaId = this.areaId;
  }

  insertControl(areaContainer, control, nodeOffset = null) {
    const fbControlWrapper = new ControlEdition(control, {
      onSave: function (controlEditor) {
        const { control } = controlEditor;
        try {
          const container = $(controlEditor.getIdSelector()).find('.fb-wrapper-content').first();

          control.renderInParent(container);
          console.log('Control saved', control.toJSON());
        } catch (error) {
          console.log('Error saving control', error);
        }
      },
      onDelete: function (controlEditor) {
        const { control } = controlEditor;
        BuildArea.getInstance().removeControl(control);
      },
    });

    const renderedControl = fbControlWrapper.render();
    const position = appendControlEdition(areaContainer, renderedControl, nodeOffset);
    control.renderInParent($(renderedControl).find('.fb-wrapper-content'));
    fbControlWrapper.addButtonEvents();
    return position;
  }

  toDisplay(parentContainer) {
    const container = markup('div', '', {
      class: 'col',
      id: this.id,
      'data-parentAreaId': this.parentAreaId,
      'data-areaId': this.areaId,
    });
    for (let i = 0; i < this.children.length; i++) {
      const elm = this.children[i];
      elm.toDisplay(container);
    }
    if (parentContainer) {
      parentContainer.append(container);
    } else {
      return container;
    }
  }

  render(customProps, attr) {
    this.toggleEmptyDropableControl();

    for (let i = 0; i < this.children.length; i++) {
      const elm = this.children[i];
      this.insertControl(this.$c, elm);
    }
    return markup('span');
  }
}

const emptyDropableControl = markup('div', 'Drop a component here', {
  class: [CLASS_EMPTY_DROPABLE, 'inner-block'].join(' '),
});

function appendControlEdition(parent, node, nodeOffset = null) {
  let pos = 0;
  if (nodeOffset) {
    const childNodes = parent.childNodes;
    for (pos = 0; pos < childNodes.length; pos++) {
      const child = childNodes[pos];
      if (child.offsetTop >= nodeOffset) {
        parent.insertBefore(node, child);
        return pos;
      }
    }
  } else {
    pos = parent.children().length;
  }
  parent.append(node);
  return pos;
}
