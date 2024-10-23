import ControlEdition from '../../edition/control-edition';
import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/layout-properties';
import LayoutControl from '../layout-setup';
import { BUILDER_TOOLBOX } from '../toolbox-store';
import { CLASS_DROPABLE_BLOCKS, CLASS_EMPTY_DROPABLE } from '../utils/constants';
import { LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';

const defaultSettings = {};

export class DropableBlock extends LayoutControl {
  children = [];
  $c;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);

    this.setup();
  }

  setup() {
    this.container_class = CLASS_DROPABLE_BLOCKS;
    this.displayControlProps = new ColumnsDisplayProps(this.props);
  }

  setContainer(container, render = false) {
    container.append(markup('div', '', { class: this.container_class }));
    this.$c = container.find(`.${this.container_class}`);
    if (render) this.renderInContainer();
  }

  renderInContainer() {
    if (this.$c) {
      this.$c.empty();
      this.render();
      this.$c.sortable({
        placeholder: 'ui-state-highlight',
        helper: 'clone',
        cursor: 'move',
        scroll: false,
        tolerance: 'pointer',
        cancel: `.${CLASS_EMPTY_DROPABLE}`,
        connectWith: `.${this.container_class}`,
      });
      this.$c.on('sortupdate', this, function (event, ui) {
        const _this = event.data;
        if (ui.sender) {
          if (ui.sender.hasClass('fb-dropable-blocks')) {
          } else {
            if (this !== event.target) return; // This avoids duplication on multiple dropable blocks

            ui.sender.sortable('cancel');
            try {
              const data = ui.item[0].dataset;
              const controlType = data.controlType;
              const { attr, props, controlClass } = BUILDER_TOOLBOX[controlType];
              const elm = new controlClass(attr, props);
              const nodeOffset = ui.offset.top;
              if (_this.children.length === 0) {
                _this.$c.empty();
              }
              _this.insertControl(this, elm, nodeOffset);
            } catch (error) {
              console.log("Couldn't append element", error);
            }
          }
        }
      });
      this.$c.on('sortremove', function (event, ui) {
        console.log('sorting between block');
      });
      this.$c.on('sortreceive', function (event, ui) {
        console.log('sorting between block');
      });

      $(`.${this.container_class}`).disableSelection();
    }
  }

  insertControl(areaContainer, control, nodeOffset = null) {
    const fbControlWrapper = new ControlEdition(control, {
      onSave: function (controlEditor) {
        const { control } = controlEditor;
        try {
          const container = $(controlEditor.getIdSelector()).find('.fb-wrapper-content').first();

          control.renderInParent(container);
        } catch (error) {
          console.log('Error saving control', error);
        }
      },
    });

    this.children.push(control);
    const renderedControl = fbControlWrapper.render();
    appendControlEdition(areaContainer, renderedControl, nodeOffset);
    control.renderInParent($(renderedControl).find('.fb-wrapper-content'));
    fbControlWrapper.addButtonEvents();
  }

  render(customProps, attr) {
    const container = markup('div', 'Drop a component here', {
      class: [CLASS_EMPTY_DROPABLE, 'inner-block'].join(' '),
      // 'data-content': 'Drag a field from the right to this area',
    });
    if (this.children.length === 0) {
      this.$c.append(container);
    } else {
      for (let i = 0; i < this.children?.length; i++) {
        const elm = this.children[i];
        this.insertControl(this.$c, elm);
      }
    }

    return container;
  }
}

function appendControlEdition(parent, node, nodeOffset = null) {
  if (nodeOffset) {
    const childNodes = parent.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      if (child.offsetTop > nodeOffset) {
        parent.insertBefore(node, child);
        return;
      }
    }
  }
  parent.append(node);
}
