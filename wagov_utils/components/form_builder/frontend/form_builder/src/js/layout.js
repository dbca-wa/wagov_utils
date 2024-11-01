import { BUILDER_TOOLBOX } from '../controls/toolbox-store';
import baseModalTemplate from '../views/control-edition/base-modal.handlebars';
import baseModalBodyEdition from '../views/control-edition/base-modal-edition.handlebars';

import { markup } from './utils';
import { appSelectors } from './selectors';

import { CONTROL_TYPES } from '../controls/utils/control-types';
import { ELEMENT_TYPES } from '../controls/utils/element-types';
import { LAYOUT_TYPES } from '../controls/utils/layout-types';
import { CLASS_DROPABLE_BLOCKS } from '../controls/utils/constants';
import { BuildArea } from './fb-build-area';
import { HTMLComponent } from '../controls/layout/html-component';

import Tab from 'bootstrap/js/dist/tab.js';
import builderTemplate from '../views/builder/container.handlebars';

const formAreaSel = 'formarea';

const controlsSel = 'formcomponents';
const formBuilderSel = 'formbuilder';
const formViewerSel = 'formviewer';

const MODES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
};

export default class LayoutController {
  formControls = [];
  constructor(formBuilder, formControls) {
    this.b = formBuilder.$builder; // HTML
    this.formControls = formControls;
    BuildArea.getInstance().setBuilder(formBuilder);
    this.buildArea = BuildArea.getInstance();
    this.controlsPanel = undefined;
    this.mode = MODES.EDIT;
  }

  initialBuilderLayout() {
    this.b.empty();
    this.b.append(builderTemplate({}));

    this.toggleMode(MODES.EDIT);

    this.addMenuButtonsEvents();
    this.insertModals();
  }

  loadFormControls(parent) {
    this.formControls.forEach((control) => {
      if (!control.label) return;
      const controlElement = markup(
        'div',
        [
          markup('i', '', { class: control.icon }),
          markup('span', control.label, {
            class: 'ml-2',
          }),
        ],
        {
          class: 'control draggable-control ',
          'data-controlType': control.type,
        },
      );

      parent.append(controlElement);
    });
  }

  renderFormBuilder(initialJson = []) {
    this.initialBuilderLayout();
    if (initialJson.length === 0) $('#btn-load-default').trigger('click');

    const instantiateControl = (control) => {
      const children = [];
      if (control.hasOwnProperty('children') && control.children.length > 0) {
        children.concat(control.children.map((child) => instantiateControl(child)));
      }
      const { attr, props, controlClass } = BUILDER_TOOLBOX[control?.elementType];

      if (!controlClass)
        return `Could not find control class for ${control?.elementType} coming from ${JSON.stringify(control)}`;

      const _attr = control?.attr ?? attr;
      const _props = control?.props ?? props;

      const element = new controlClass(_attr, _props);
      if (children.length > 0) {
        element.children = children;
      }
      return element;
    };

    initialJson.forEach((control) => {
      const element = instantiateControl(control);
      this.buildArea.area.addControl(this.buildArea.area.$c, element);
    });
  }

  addMenuButtonsEvents() {
    $('#btn-mode').on('click', this, function (event) {
      const layout = event.data;
      layout.toggleMode();
    });
    $('#btn-save-form').on('click', this, function (event) {
      const layout = event.data;
      const formJson = layout.buildArea.toJSON();
      console.log('Saving form', formJson);
      window.localStorage.setItem('storedForm', JSON.stringify(formJson));
    });
    $('#btn-load-form').on('click', this, function (event) {
      const layout = event.data;
      const storedForm = window.localStorage.getItem('storedForm');
      if (!storedForm) return;
      layout.renderFormBuilder(JSON.parse(storedForm));
    });
    $('#btn-new-form').on('click', this, function (event) {
      window.localStorage.removeItem('storedForm');
    });
    $('#btn-load-default').on('click', this, function (event) {
      const layout = event.data;
      const defaultElements = [
        LAYOUT_TYPES.HTML_CONTENT,
        ELEMENT_TYPES.SELECT_BOXES,
        LAYOUT_TYPES.COLUMNS_ROW,
        ELEMENT_TYPES.INPUT_NUMBER,
        // ELEMENT_TYPES.SELECT,
        // ELEMENT_TYPES.CHECK_BOX,
        // ELEMENT_TYPES.RADIO,
        // ELEMENT_TYPES.BUTTON,
      ];
      layout.renderFormBuilder(defaultElements.map((el) => ({ elementType: el })));
    });
  }

  toggleMode(mode) {
    this.mode = mode ? mode : this.mode === MODES.EDIT ? MODES.PREVIEW : MODES.EDIT;
    if (this.mode === MODES.EDIT) {
      $('#btn-mode')
        .empty()
        .append(' Preview &nbsp;', markup('i', '', { class: 'bi bi-eye' }));
      this.enableEditMode();
    } else {
      $('#btn-mode')
        .empty()
        .append(' Edit &nbsp;', markup('i', '', { class: 'bi bi-pencil' }));
      this.enableViewMode();
    }
  }

  enableEditMode() {
    $(`#${formViewerSel}`).empty();
    $(`#${formBuilderSel}`).addClass(formBuilderSel);
    $(`#${formBuilderSel}`).append(markup('div', '', { id: controlsSel, class: 'formcomponents' }));
    $(`#${formBuilderSel}`).append(
      markup('div', '', {
        id: formAreaSel,
        class: 'formarea fb-dropable-blocks',
        'data-content': 'Drag a field from the right to this area',
      }),
    );

    this.buildArea.setAreaContainer($(`#${formAreaSel}`));
    this.controlsPanel = $(`#${controlsSel}`);

    // $(`.${formAreaSel}`).disableSelection();

    $(`.${controlsSel}`).sortable({
      helper: 'clone',
      cursor: 'move',
      scroll: false,
      tolerance: 'pointer',
      placeholder: 'ui-state-highlight',
      connectWith: `.${CLASS_DROPABLE_BLOCKS}`,
    });

    this.loadFormControls(this.controlsPanel);
    $(`.${controlsSel}`).disableSelection();
  }

  enableViewMode() {
    $(`#${formBuilderSel}`).empty();
    $(`#${formBuilderSel}`).attr('class', '');

    $(`#${controlsSel}`).empty();
    this.buildArea.viewForm($(`#${formViewerSel}`));
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
