import Component from 'can/component/';
import CanMap from 'can/map/';

import widgetModel from '../../../widget-model';
import template from './json-field.stache!';
import { mapToFields, parseFieldArray } from '../../../../util/field';

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
      get: function(val) {
        let template = this.attr('properties.objectTemplate');
        let obj = this.attr('value') ? JSON.parse(this.attr('value')) : {};
        if (template) {
          return new template(obj);
        }
        return null;
      }
    },
    formFields: {
      get(){
        if(this.attr('properties.fields')){
          return parseFieldArray(this.attr('properties.fields'));
        }
        return mapToFields(this.attr('jsonFormObject'));
      }
    }
  },
  saveField: function(scope, dom, event, obj) {
    let json = JSON.stringify(obj.attr());
    this.attr('value', json);
    this.dispatch('change', [json]);
  }
});

Component.extend({
  tag: 'json-field',
  template: template,
  viewModel: ViewModel
});
