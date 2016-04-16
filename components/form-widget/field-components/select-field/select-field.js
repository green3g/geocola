import Component from 'can/component/';
import widgetModel from 'components/widget-model';

import template from './select-field.stache!';

/**
 * @constructor components/form-widget/field-components/select-field.ViewModel ViewModel
 * @parent components/form-widget/field-components/select-field
 * @group components/form-widget/field-components/select-field.ViewModel.props Properties
 *
 * @description A `<select-field />` component's ViewModel
 */
export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: Map
    }
  },
  onChange(value) {
    //we could perform some other logic here
    this.attr('properties.value', value);
    this.dispatch('change', [value]);
  },
  isSelected(value){
    return value == this.attr('properties').value;
  }
});

Component.extend({
  tag: 'select-field',
  template: template,
  viewModel: ViewModel
});
