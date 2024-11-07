import {
  CONTROL_DATA_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../../utils/control-props-types';
import { INPUT_TYPES } from '../../utils/input-types';
import { dateDataPropertiesStore } from '../stores/data-props-store';
import { BaseDataProps } from './base-data-props';
import { MultipleChoiceDataProperties } from './multiple-choice-data-props';

const defProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];

const selectelementProps = [
  CONTROL_DATA_PROPS_TYPES.MULTI,
  CONTROL_DATA_PROPS_TYPES.DATASOURCE,
  CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE,
];
const radioButtonProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE];
const selectBoxesProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE];

export class BasicDataProperties extends BaseDataProps {
  datasourceProperties;

  constructor(props) {
    super(defProps);
    this.fillInProps(props);
  }
}

export class InputFieldDataProperties extends BaseDataProps {
  datasourceProperties;

  constructor(type = INPUT_TYPES.TEXT, props) {
    const definition = [];
    if (type !== INPUT_TYPES.PASSWORD) {
      definition.push(...defProps);
    }

    super(definition);
    this.fillInProps(props);

    this.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
      type: type === INPUT_TYPES.CHECK_BOX ? 'boolean' : type === INPUT_TYPES.TEXT ? 'string' : type,
    });
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    _this.modifyPropValue(prop.name, value);
    _this.editor._renderPreviewControl();
  }
}

export class SelectDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, selectelementProps);
  }
}

export class RadioButtonsDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, radioButtonProps);
  }
}

export class SelectBoxesDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, selectBoxesProps);
    if ([DATASOURCE_PROPS_TYPES.VALUES, DATASOURCE_PROPS_TYPES.RAW_JSON].includes(this.datasource)) {
      this.datasourceProperties.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
        type: 'select-boxes',
        value: [],
      });
    }
  }
}

export class DatePickerDataProperties extends BaseDataProps {
  constructor(props) {
    const definition = [
      // DATE_DATA_PROPS_TYPES.ENABLE_DATE_INPUT,
      // DATE_DATA_PROPS_TYPES.ENABLE_TIME_INPUT,
      CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE,
      DATE_DATA_PROPS_TYPES.DISABLE_WEEKENDS,

      // DATE_DATA_PROPS_TYPES.DISABLE_WEEKDAYS,
      // DATE_DATA_PROPS_TYPES.HOUR_FORMAT,
    ];

    super(definition, dateDataPropertiesStore);
    this.fillInProps(props);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    console.log('value', value);
    _this.modifyPropValue(prop.name, value);
    _this.editor._renderPreviewControl();
  }
}
