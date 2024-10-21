import { CONTROL_DATA_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../utils/control-props-types';
import { BaseControlProps } from './base-control-props';
import { DATASOURCE_VALUES, datasourceDataPropertiesStore } from './predefined/data-props-store';

const multiSelectProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];

const defProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
const selectelementProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DATASOURCE];

const dsValues = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.VALUES];
const dsURL = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.URL];

class BaseDataProps extends BaseControlProps {
  $p;
  editor;

  constructor(props) {
    super(props);
  }

  renderInParent() {
    if (this.$p) {
      this.$p.empty().append(this.render());
    }
    super.addChangeEvents(this, this._onDataPropsChange);
  }

  setEditor(parentContainer = {}, editor = {}) {
    this.$p = parentContainer;
    this.editor = editor;
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;

    const value = e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e.value;
    _this.editor.initialProps[prop.name] = value;
  }
}

export class BasicDataProperties extends BaseDataProps {
  datasourceProperties;

  constructor(props) {
    super(defProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class SelectDataProperties extends BaseDataProps {
  datasource;

  constructor(props) {
    super(selectelementProps);
    this.fillInProps(props);
    this.selectDatasource(this.props[CONTROL_DATA_PROPS_TYPES.DATASOURCE]?.prop.value);
    this.datasourceProperties.fillInProps(props);
    if (this.datasource === DATASOURCE_PROPS_TYPES.VALUES) {
      this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE].prop.options = [...props.options] ?? [];
    }
  }

  fillInProps(hostProps) {
    super.fillInProps(hostProps);
    if (this.datasourceProperties) {
      this.datasourceProperties.fillInProps(hostProps);
    }
  }

  getPropsValues() {
    const props = super.getPropsValues();
    if (this.datasourceProperties) {
      Object.assign(props, this.datasourceProperties.getPropsValues());
    }
    return props;
  }

  selectDatasource(selectedDS) {
    this.datasource = selectedDS;
    this.modifyProp(CONTROL_DATA_PROPS_TYPES.DATASOURCE, selectedDS);
    if (selectedDS === DATASOURCE_PROPS_TYPES.VALUES) {
      this.datasourceProperties = new BaseControlProps(
        dsValues,
        datasourceDataPropertiesStore[DATASOURCE_VALUES.VALUES],
      );
    } else if (selectedDS === DATASOURCE_PROPS_TYPES.URL) {
      this.datasourceProperties = new BaseControlProps(dsURL, datasourceDataPropertiesStore[DATASOURCE_VALUES.URL]);
    }
    // this.datasourceProperties.fillInProps({
    //   [CONTROL_DATA_PROPS_TYPES.DATASOURCE]: selectedDS,
    // });
  }

  setEditor(parentContainer, editor) {
    this.$p = parentContainer;
    this.editor = editor;
  }

  clearEditor() {
    this.$p = null;
  }

  defaultEvents() {}

  renderInParent() {
    if (this.$p) {
      this.$p.empty().append(this.render());
      super.addChangeEvents(this, this._onDataPropsChange);
      this.datasourceProperties.addChangeEvents(this, this._onDataPropsChange);
    }
  }

  addChangeEvents(context, cb) {
    super.addChangeEvents(context, cb);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;

    const value = e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e.value;
    _this.editor.initialProps[prop.name] = value;

    if (this.id === 'cp-dataSource') {
      _this.selectDatasource(value);
      _this.renderInParent();
    }

    if (prop.name === 'values') {
      _this.datasourceProperties.fillInProps(_this.editor.initialProps);
      _this.editor._renderPreviewControl();
      if (_this.datasource === DATASOURCE_PROPS_TYPES.VALUES) {
        _this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE].prop.options = value;
        _this.renderInParent(); // TODO: Just render the default value prop
      }
    }
  }

  render() {
    const container = super.render();

    if (this.datasourceProperties) {
      container.appendChild(this.datasourceProperties.render());
    }

    return container;
  }
}
