import { generateRandomId, markup } from '../../../js/utils';
import { _renderProp } from '../control-prop';

export class DynamicTableControl {
  id;
  sortable = false;
  constructor(props, tableData = { structure: {}, values: [] }) {
    const { structure, values } = tableData;
    this.id = props.id;
    this.sortable = props.sortable || false;
    this.structure = structure;
    this.values = values === '' ? [] : values;
    this.columns = ['id'].concat(Object.keys(structure).map((key) => structure[key].name)).concat('actions');
    console.log(structure);
  }

  _createHeaders() {
    const tHeaders = [];
    for (const column of this.columns) {
      tHeaders.push(this._createColumn(column));
    }
    return markup(
      'table',
      [
        {
          tag: 'thead',
          content: [{ tag: 'tr', content: tHeaders }],
        },
      ],
      { class: 'table table-bordered', id: this.id },
    );
  }
  _createColumn(column) {
    return markup('th', column, { scope: 'col' });
  }

  _createDataRow(row) {
    if (!row) return;
    const rowEl = markup('tr', [{ tag: 'td', content: markup('span', 'X', { class: 'btn btn-default ' }) }], {
      id: row.id,
      class: 'data-row',
    });
    delete row.id;
    for (const column of this.columns) {
      if (column === 'actions') {
        rowEl.appendChild(markup('td', row[column]));
        continue;
      }
      if (this.structure[column]) {
        rowEl.appendChild(
          markup('td', _renderProp({ ...this.structure[column], value: row[column], dataKey: column })),
        );
      }
    }

    return rowEl;
  }

  _parseRowData(val) {
    const rowId = 'row-' + generateRandomId();
    return {
      ...val,
      id: rowId,
      actions: markup('button', 'X', {
        class: 'btn btn-primary ',
        'data-rowId': rowId,
        events: {
          click: (e) => {
            e.preventDefault();
            const { rowId } = e.target.dataset;
            if (rowId) {
              document.getElementById(rowId).remove();
            }
          },
        },
      }),
    };
  }

  render() {
    const table = this._createHeaders();
    const tbody = markup('tbody', '');
    table.appendChild(tbody);
    const tableBody = this.values.map(this._parseRowData);
    for (let i = 0; i < tableBody.length; i++) {
      const row = this._createDataRow(tableBody[i]);
      table.querySelector('tbody').appendChild(row);
    }
    const addRowButton = markup(
      'tr',
      markup(
        'td',
        [
          {
            tag: 'button',
            content: 'Add Row',

            class: 'btn btn-primary',
            events: {
              click: {
                data: {
                  saludo: 'Hola Juanchito',
                },
                fn: (e) => {
                  e.preventDefault();
                  const initial = Object.fromEntries(
                    Object.entries(this.structure).map(([key, { value }]) => [key, value]),
                  );
                  const newRow = this._parseRowData(initial);
                  const row = this._createDataRow(newRow);
                  e.target.closest('tr').insertAdjacentElement('beforebegin', row);
                },
              },
            },
          },
        ],
        {
          colspan: this.columns.length,
        },
      ),
    );

    table.querySelector('tbody').appendChild(addRowButton);
    return table;
  }
}
