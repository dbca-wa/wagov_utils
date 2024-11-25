import { markup } from './utils';
import { BuildArea, instantiateJsonControl } from './fb-build-area';

const formViewerSel = 'formviewer';

export default class ViewerLayoutController {
  form;

  constructor(formBuilder) {
    this.b = formBuilder.$builder; // HTML
    BuildArea.getInstance().setBuilder(formBuilder);
    this.buildArea = BuildArea.getInstance();
  }

  initialViewerLayout() {
    this.b.empty();
    this.b.append(markup('div', '', { id: formViewerSel }));
    $(`#${formViewerSel}`)
      .empty()
      .append(markup('form', '', { class: 'needs-validation', novalidate: '' }));
    this.form = $(`#${formViewerSel} form`);

    this.buildArea.area.children.splice();
    this.insertModals();
  }

  renderForm(initialJson = [], options = {}) {
    const { initialValue } = options;
    this.initialViewerLayout();
    this.buildArea.clearAreaContainer();

    initialJson.forEach((control) => {
      try {
        const element = instantiateJsonControl(control);

        this.buildArea.area.children.push(element);
      } catch (error) {
        console.error(error);
      }
    });
    this.buildArea.area.setInitialValue(initialValue);
    this.buildArea.viewForm(this.form);
  }

  getFormData() {
    return this.buildArea.area.getFieldValue();
  }

  insertModals() {}
}
