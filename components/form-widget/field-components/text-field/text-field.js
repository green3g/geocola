import Component from 'can/component/';

import widgetModel from '../../../widget-model';
import template from './text-field.stache!';
/**
 * @constructor components/form-widget/field-components/text-field.ViewModel ViewModel
 * @parent components/form-widget/text-components/date-field
 * @group components/form-widget/field-components/text-field.ViewModel.props Properties
 *
 * @description A `<text-field />` component's ViewModel
 */
export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: can.Map
    }
  },
  onChange(element) {
    this.dispatch('change', [element.value]);
  }
});

Component.extend({
  tag: 'text-field',
  template: template,
  viewModel: ViewModel
});
