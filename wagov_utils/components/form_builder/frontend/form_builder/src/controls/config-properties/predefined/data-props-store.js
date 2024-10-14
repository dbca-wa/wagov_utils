import { CONTROL_DATA_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../../utils/control-props-types';

const DEFAULT_VALUE_PROPS = {
  name: 'defaultValue',
  title: 'Default Value',
  type: 'string',
  placeholder: 'Enter a default value',
  required: false,
  options: undefined,
  value: '',
};

export const DATASOURCE_VALUES = {
  VALUES: 'values',
  URL: 'url',
};

export const dataPropertiesStore = {
  [CONTROL_DATA_PROPS_TYPES.DATASOURCE]: {
    name: 'dataSource',
    title: 'Data Source',
    type: 'select',
    placeholder: 'Select a data source',
    required: true,
    options: [
      { text: 'Values', value: DATASOURCE_VALUES.VALUES },
      { text: 'URL', value: DATASOURCE_VALUES.URL },
    ],
    value: 'values',
  },
  [CONTROL_DATA_PROPS_TYPES.MULTI]: {
    name: 'multipleValues',
    title: 'Multiple Values',
    type: 'boolean',
    placeholder: 'Multiple Values',
    required: false,
    options: undefined,
    value: false,
  },
  [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_VALUE_PROPS },
};

export const datasourceDataPropertiesStore = {
  [DATASOURCE_VALUES.VALUES]: {
    [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_VALUE_PROPS },
    [DATASOURCE_PROPS_TYPES.VALUES]: {
      name: 'values',
      title: 'Enter Values',
      placeholder: 'Enter values',
      type: 'array',
      structure: {
        value: {
          name: 'value',
          title: 'Value',
          type: 'string',
          placeholder: 'Enter a value',
          required: true,
          options: undefined,
          value: '',
        },
        label: {
          name: 'label',
          title: 'Label',
          type: 'string',
          placeholder: 'Enter a label',
          required: true,
          options: undefined,
          value: '',
        },
      },
      required: true,
      options: undefined,
      value: '',
    },
  },
  [DATASOURCE_VALUES.URL]: {
    [DATASOURCE_PROPS_TYPES.URL]: {
      name: 'url',
      title: 'URL',
      type: 'string',
      placeholder: 'Enter a URL',
      required: true,
      options: undefined,
      value: '',
    },
    [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_VALUE_PROPS },
  },
};
