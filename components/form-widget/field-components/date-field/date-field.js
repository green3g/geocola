
import Component from 'can/component/';
import CanMap from 'can/map/';

import widgetModel from 'components/widget-model';
import template from './date-field.stache!';
import 'date-selector/less/datepicker.less!';
import dateSelector from 'date-selector';

/**
 * @constructor components/form-widget/field-components/date-field.ViewModel ViewModel
 * @parent components/form-widget/field-components/date-field
 * @group components/form-widget/field-components/date-field.ViewModel.props Properties
 *
 * @description A `<date-field />` component's ViewModel
 */
export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: CanMap
    }
  },
  onChange(element) {
    this.dispatch('change', [element.value]);
  }
});

Component.extend({
  tag: 'date-field',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      dateSelector();
    }
  }
});
