import { CONTROLS_STORE, LAYOUT_STORE } from '../controls/toolbox-store';
import ControlEdition from '../edition/control-edition';
import baseModalTemplate from '../views/control-edition/base-modal.handlebars';
import baseModalBodyEdition from '../views/control-edition/base-modal-edition.handlebars';

import { markup } from './utils';
import { appSelectors } from './selectors';

import Tab from 'bootstrap/js/dist/tab.js';
import Control from './fb-control';
import { CONTROL_TYPES } from '../controls/utils/control-types';
import { ELEMENT_TYPES } from '../controls/utils/element-types';
import { LAYOUT_TYPES } from '../controls/utils/layout-types';

const formAreaSel = 'formarea';
const CLASS_DROPABLE_BLOCKS = 'fb-dropable-blocks';
const controlsSel = 'formcomponents';

const BUILDER_TOOLBOX = Object.assign({}, CONTROLS_STORE, LAYOUT_STORE);

export default class LayoutController {
  constructor(builderElement, body) {
    this.b = builderElement; // HTML
    this.body = body;
    this.formArea = undefined;
    this.controlsPanel = undefined;
  }

  initialLayout(controls) {
    this.body.push(new Control({}, { containerClass: 'container' }, CONTROL_TYPES.BLOCK, 'formbuilder'));
    let formbuilder = markup('div', '', { id: 'formbuilder' });
    let controlsPanel = markup('div', '', { id: controlsSel, class: controlsSel });
    let builderArea = markup('div', '', {
      id: formAreaSel,
      class: [formAreaSel, CLASS_DROPABLE_BLOCKS].join(' '),
      'data-content': 'Drag a field from the right to this area',
    });

    this.b.append(formbuilder);

    const formbuilderElement = $('#formbuilder');
    formbuilderElement.append(controlsPanel);
    formbuilderElement.append(builderArea);
    this.formArea = $(`#${formAreaSel}`);

    this.controlsPanel = $(`#${controlsSel}`);

    this.formArea.sortable({
      placeholder: 'ui-state-highlight',
      helper: 'clone',
      cursor: 'move',
      scroll: false,
      tolerance: 'pointer',
    });
    this.formArea.on('sortupdate', this, function (event, ui) {
      const _this = event.data;
      if (ui.sender) {
        ui.sender.sortable('cancel');
        try {
          const data = ui.item[0].dataset;
          const controlType = data.controlType;
          const { attr, props, controlClass } = BUILDER_TOOLBOX[controlType];
          const elm = new controlClass(attr, props);
          const nodeOffset = ui.offset.top;
          _this.insertControl(this, elm, nodeOffset);
        } catch (error) {
          console.log("Couldn't append element", error);
        }
      }
    });

    $(`.${formAreaSel}`).disableSelection();

    $(`.${controlsSel}`).sortable({
      helper: 'clone',
      cursor: 'move',
      scroll: false,
      tolerance: 'pointer',
      placeholder: 'ui-state-highlight',
      connectWith: `.${CLASS_DROPABLE_BLOCKS}`,
    });

    this.loadFormControls(controls, this.controlsPanel);
    $(`.${controlsSel}`).disableSelection();

    this.insertModals();
  }

  loadFormControls(controls, parent) {
    controls.forEach((control) => {
      if (!control.label) return;
      const controlElement = markup('div', markup('span', control.label), {
        class: 'control draggable-control',
        'data-controlType': control.type,
      });

      parent.append(controlElement);
    });
  }

  renderForm() {
    this.formArea.append(markup('h2', 'Form Builder DBCA', {}));
    const defaultElements = [
      // ELEMENT_TYPES.INPUT,
      // ELEMENT_TYPES.INPUT_NUMBER,
      // ELEMENT_TYPES.SELECT,
      // ELEMENT_TYPES.CHECK_BOX,
      // ELEMENT_TYPES.RADIO,
      LAYOUT_TYPES.COLUMNS,
    ];
    defaultElements.forEach((element) => {
      const { attr, props, controlClass } = BUILDER_TOOLBOX[element];
      const elm = new controlClass(attr, props);
      this.insertControl(this.formArea, elm);
    });
  }

  insertModals() {
    const idSelector = appSelectors.modalControlEdition;
    this.b.append(
      baseModalTemplate({
        id: idSelector,
      }),
    );
    $(`#${appSelectors.modalControlEdition} .modal-body`).append(baseModalBodyEdition({ title: 'Test Modal' }));
    const triggerTabList = document.querySelectorAll('#tabsEdition button');
    triggerTabList.forEach((triggerEl) => {
      const tabTrigger = new Tab(triggerEl);

      triggerEl.addEventListener('click', (event) => {
        event.preventDefault();
        tabTrigger.show();
      });
    });
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
    this.body.push(control);
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
