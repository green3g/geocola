import Component from 'can/component/';
import CanMap from 'can/map/';

import widgetModel from 'components/widget-model';
import template from './json-field.stache!';

/**
 * @constructor components/form-widget/field-components/json-field.ViewModel ViewModel
 * @parent components/form-widget/field-components/json-field
 * @group components/form-widget/field-components/json-field.ViewModel.props Properties
 *
 * @description A `<json-field />` component's ViewModel
 */
export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: CanMap
    },
    jsonFormObject: {
      get: function() {
        var props = this.attr('properties');
        return new props.template(props.value ? JSON.parse(
          props.value
        ) : {});
      }
    }
  },
  saveField: function(scope, dom, event, obj) {
    this.dispatch('change', [JSON.stringify(obj.attr())]);
  }
});

Component.extend({
  tag: 'json-field',
  template: template,
  viewModel: ViewModel
});
