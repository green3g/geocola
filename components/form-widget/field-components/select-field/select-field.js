import Component from 'can/component/';
import widgetModel from '../../../widget-model';
import CanMap from 'can/map/';
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
      Value: CanMap
    }
  },
  onChange(value) {
    //we could perform some other logic here
    this.attr('value', value);
    this.dispatch('change', [value]);
  },
  isSelected(value){
    return value == this.attr('value');
  }
});

Component.extend({
  tag: 'select-field',
  template: template,
  viewModel: ViewModel
});
