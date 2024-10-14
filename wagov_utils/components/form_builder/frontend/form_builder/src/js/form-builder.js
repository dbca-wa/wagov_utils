/* eslint-disable prefer-spread */

import LayoutController from './layout';

import { FORM_CONTROLS } from '../controls/toolbox';

/* eslint-disable no-plusplus */
function FormBuilder(element, settings, $) {
  var _ = this;
  var dataSettings;

  _.defaults = {
    name: 'DBCA-FORMBUILDER',
  };

  _.initials = {
    present: true,
  };
  $.extend(_, _.initials);

  dataSettings = $(element).data('juanchi') || {};

  _.$builder = $(element);

  _.body = [];

  _.layout = new LayoutController(_.$builder, _.body);

  _.$controlFactory = undefined;
  _.options = $.extend({}, _.defaults, settings, dataSettings);

  _.originalSettings = _.options;

  _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

  _.init(true);
}

FormBuilder.prototype.init = function () {
  const _ = this;
  _.layout.initialLayout(FORM_CONTROLS);
  _.layout.renderForm();
};

jQuery.fn.formBuilder = function (...args) {
  const _ = this;
  const opt = args[0];
  const moreArgs = Array.prototype.slice.call(args, 1);
  const l = _.length;
  let i;
  let ret;

  for (i = 0; i < l; i++) {
    if (typeof opt === 'object' || typeof opt === 'undefined') {
      _[i].formb = new FormBuilder(_[i], opt, jQuery);
    } else {
      ret = _[i].formb[opt].apply(_[i].formb, moreArgs, jQuery);
    }
    if (typeof ret !== 'undefined') return ret;
  }
  return _;
};
