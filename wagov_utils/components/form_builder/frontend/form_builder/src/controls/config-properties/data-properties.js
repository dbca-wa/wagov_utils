import { CONTROL_DATA_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../utils/control-props-types';
import BaseControlProps from './base-control-props';
import { DATASOURCE_VALUES, datasourceDataPropertiesStore } from './predefined/data-props-store';

const multiSelectProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];

const defProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
const selectelementProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DATASOURCE];

const dsValues = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.VALUES];
const dsURL = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.URL];

export class BasicDataProperties extends BaseControlProps {
  datasourceProperties;

  constructor(props) {
    super(defProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class SelectDataProperties extends BaseControlProps {
  constructor(props) {
    super(selectelementProps);
    this.fillInProps(props);
    this.selectDatasource(this.props[CONTROL_DATA_PROPS_TYPES.DATASOURCE]?.prop.value);
  }

  selectDatasource(selectedDS) {
    this.modifyProp(CONTROL_DATA_PROPS_TYPES.DATASOURCE, selectedDS);
    if (selectedDS === DATASOURCE_PROPS_TYPES.VALUES) {
      this.datasourceProperties = new BaseControlProps(
        dsValues,
        datasourceDataPropertiesStore[DATASOURCE_VALUES.VALUES],
      );
    } else if (selectedDS === DATASOURCE_PROPS_TYPES.URL) {
      this.datasourceProperties = new BaseControlProps(dsURL, datasourceDataPropertiesStore[DATASOURCE_VALUES.URL]);
    }
    this.datasourceProperties.fillInProps({
      [CONTROL_DATA_PROPS_TYPES.DATASOURCE]: selectedDS,
    });
  }

  render() {
    const container = super.render();

    if (this.datasourceProperties) {
      container.appendChild(this.datasourceProperties.render());
    }

    return container;
  }
}
