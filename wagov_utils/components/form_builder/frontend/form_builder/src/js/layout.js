import { BUILDER_TOOLBOX, CONTROLS_STORE, LAYOUT_STORE } from '../controls/toolbox-store';
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
import { CLASS_DROPABLE_BLOCKS } from '../controls/utils/constants';
import { DropableBlock } from '../controls/layout/dropable-control';

const formAreaSel = 'formarea';

const controlsSel = 'formcomponents';

export default class LayoutController {
  constructor(builderElement, body) {
    this.b = builderElement; // HTML
    this.body = body;
    this.buildArea = new DropableBlock();
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

    this.buildArea.setContainer($(`#${formAreaSel}`), true);

    this.controlsPanel = $(`#${controlsSel}`);

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
    this.buildArea.$c.append(markup('h2', 'Form Builder DBCA', {}));
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
      this.buildArea.addControl(this.buildArea.$c, elm);
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
}
