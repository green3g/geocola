import widgetModel from 'components/widget-model';
import can from 'can';
import template from './json-field.stache!';

/**
 * @module form-widget.fields.text Text
 * @parent form-widget.fields
 * @body
 * A generic text box with a label. If the `type` property is not provided, `'text'` is the default.
 *
 * `type: 'text'`
 */

/**
 * @typedef {textFieldProperties} form-widget.types.jsonFieldProperties jsonFieldProperties
 * @parent form-widget.types
 * @option {can.Map} map The object to use as the form object template
 * @option {Array<String|form-widget.types.formFieldObject>} formFields The form fields to use in the form
 */

export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: can.Map
    },
    jsonFormObject: {
      get: function() {
        var props = this.attr('properties');
        return new props.map(props.value ? JSON.parse(
          props.value
        ) : {});
      }
    }
  },
  saveField: function(scope, dom, event, obj) {
    this.dispatch('change', [JSON.stringify(obj.attr())]);
  }
})

can.Component.extend({
  tag: 'json-field',
  template: template,
  viewModel: ViewModel
});
