import { ArrayControlProp } from './array-control-prop';
import { ControlProp, defaultAllProps } from './control-prop';

export class ControlPropFactory {
  static createControlProp(type, customPropsStore) {
    const prop = customPropsStore !== undefined ? { ...customPropsStore[type] } : { ...defaultAllProps[type] };
    if (prop.type === 'array') {
      return new ArrayControlProp(type, customPropsStore);
    }

    return new ControlProp(type, customPropsStore);
  }
}
