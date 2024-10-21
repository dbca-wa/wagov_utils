import { markup } from '../../js/utils';
import { DynamicTableControl } from './components-control-props/dynamic-table-control';
import { ControlProp } from './control-prop';

export class ArrayControlProp extends ControlProp {
  table;

  constructor(type, customPropsStore) {
    super(type, customPropsStore);
  }

  renderProp() {
    try {
      this.table = new DynamicTableControl(
        { id: this.id },
        { structure: this.prop.structure, values: this.prop.value },
      );
    } catch (error) {
      console.error(error);
      return markup('h3', 'Invalid table data.');
    }

    const children = [
      markup('label', this.prop.title, {
        class: 'form-label',
      }),
      this.table.render(),
    ];

    return markup('div', children, { class: 'form-check mb-3' });
  }

  addChangeEvent(context, cb) {
    if (!cb) return;

    this.table.addChangeEventHandler({
      fn: cb,
      context: { context, prop: this.prop },
    });
  }
}
