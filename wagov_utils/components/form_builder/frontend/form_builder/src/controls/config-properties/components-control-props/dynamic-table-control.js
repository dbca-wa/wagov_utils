import { generateRandomId, markup } from '../../../js/utils';
import { _renderProp } from '../control-prop';

export class DynamicTableControl {
  id;
  sortable = false;
  changeHandler;

  constructor(props, tableData = { structure: {}, values: [] }) {
    const { structure, values } = tableData;
    this.id = props.id;
    this.sortable = props.sortable || false;
    this.structure = structure;
    this.values = values === '' ? [] : values;
    this.columns = ['id'].concat(Object.keys(structure).map((key) => structure[key].name)).concat('actions');
    console.log(structure);
  }

  addChangeEventHandler({ fn, context }) {
    this.changeHandler = {
      fn,
      context,
    };

    this.addInputElementChange($(`#${this.id} .data-row td *[data-key]`));
    $(`#${this.id} tbody`).sortable({
      handle: '.sort-handle',

      items: '.data-row',
      placeholder: 'portlet-placeholder ',
    });

    $(`#${this.id} tbody`).on('sortupdate', this, function (e, ui) {
      const _this = e.data;
      _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value: _this.extractData() });
    });
  }

  addInputElementChange(selector) {
    $(selector).on('change', this, (e) => {
      const _this = e.data;
      _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value: _this.extractData() });
    });
  }

  extractData() {
    const data = [];
    const rows = document.querySelectorAll(`#${this.id} .data-row`);

    for (const row of rows) {
      const rowId = row.id;
      const rowValues = { id: rowId };
      const cells = row.querySelectorAll('td *[data-key]');
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const key = cell.dataset.key;
        const value = ['select', 'input'].includes(cell.tagName.toLowerCase()) ? cell.value : cell.textContent;
        rowValues[key] = value;
      }
      data.push(rowValues);
    }
    console.log({ extracted: data });
    return data;
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
    const rowEl = markup(
      'tr',
      [{ tag: 'td', content: markup('span', 'X', { class: 'btn btn-default btn-disabled sort-handle ' }) }],
      {
        id: row.id,
        class: 'data-row',
      },
    );
    delete row.id;
    for (const column of this.columns) {
      if (column === 'actions') {
        rowEl.appendChild(markup('td', row[column]));
        continue;
      }
      if (this.structure[column]) {
        rowEl.appendChild(
          markup(
            'td',
            _renderProp(
              { ...this.structure[column], value: row[column], dataKey: column },
              this.structure[column].options ?? [],
            ),
          ),
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
      actions: markup('button', 'x', {
        class: 'btn btn-primary ',
        'data-rowId': rowId,
        events: {
          click: {
            context: this,
            fn: (e) => {
              const { context: _this } = e.data;
              e.preventDefault();
              const { rowId } = e.target.dataset;
              if (rowId) {
                document.getElementById(rowId).remove();
              }
              _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value: _this.extractData() });
            },
          },
        },
      }),
    };
  }

  render() {
    const table = this._createHeaders();
    const tbody = markup('tbody', '');
    table.appendChild(tbody);
    const tableBody = this.values.map((val) => this._parseRowData(val));
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
                context: this,
                fn: (e) => {
                  const { context: _this } = e.data;
                  e.preventDefault();
                  const initial = Object.fromEntries(
                    Object.entries(_this.structure).map(([key, { value }]) => [key, value]),
                  );
                  const newRow = _this._parseRowData(initial);
                  const row = _this._createDataRow(newRow);
                  e.target.closest('tr').insertAdjacentElement('beforebegin', row);
                  _this.addInputElementChange($(`#${row.id} td *[data-key]`));
                  _this.changeHandler.fn({ data: { ..._this.changeHandler.context }, value: _this.extractData() });
                },
              },
            },
          },
        ],
        {
          colspan: this.columns.length,
          class: 'not-sortable',
        },
      ),
    );

    table.querySelector('tbody').appendChild(addRowButton);
    return table;
  }
}
