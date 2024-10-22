import ControlEdition from '../../edition/control-edition';
import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/layout-properties';
import LayoutControl from '../layout-setup';
import { BUILDER_TOOLBOX } from '../toolbox-store';
import { CLASS_DROPABLE_BLOCKS } from '../utils/constants';
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

  setContainer(container) {
    container.append(markup('div', '', { class: this.container_class }));
    this.$c = container.find(`.${this.container_class}`);
    this.renderInContainer();
  }

  renderInContainer() {
    if (this.$c) {
      this.$c.empty().append(this.render());
      this.$c.sortable({
        placeholder: 'ui-state-highlight',
        helper: 'clone',
        cursor: 'move',
        scroll: false,
        tolerance: 'pointer',
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
              _this.insertControl(this, elm, nodeOffset);
              _this.children.push(elm);
            } catch (error) {
              console.log("Couldn't append element", error);
            }
          }
        }
      });
      $(`.${this.container_class}`).disableSelection();
    }
  }

  insertControl(areaContainer, control, nodeOffset = null) {
    const fbControlWrapper = new ControlEdition(control, {
      onSave: function (controlEditor) {
        const { control } = controlEditor;
        try {
          $(controlEditor.getIdSelector()).find('.fb-wrapper-content').empty().append(control.renderControl());
        } catch (error) {
          console.log('Error saving control', error);
        }
      },
    });

    const renderedControl = fbControlWrapper.render();
    $(renderedControl).find('.fb-wrapper-content').append(control.renderControl());
    appendControlEdition(areaContainer, renderedControl, nodeOffset);
    fbControlWrapper.addButtonEvents();
  }

  render(customProps, attr) {
    const renderedChildren = [];

    for (let i = 0; i < this.children?.length; i++) {
      renderedChildren.push(this.children[i].renderControl());
    }

    return markup('div', renderedChildren, {
      class: [this.container_class, 'inner-block'].join(' '),
      // 'data-content': 'Drag a field from the right to this area',
    });
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
