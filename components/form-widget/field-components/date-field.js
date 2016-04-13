import widgetModel from 'components/widget-model';
import can from 'can';
import template from './date-field.stache!';
import 'date-selector/less/datepicker.less!';
import dateSelector from 'date-selector';
/**
 * @module form-widget.fields.text Text
 * @parent form-widget.fields
 * @body
 * A generic text box with a label. If the `type` property is not provided, `'text'` is the default.
 *
 * `type: 'text'`
 */

/**
 * @typedef {textFieldProperties} form-widget.types.textFieldProperties textFieldProperties
 * @parent form-widget.types
 * @option {String} type The type of textbox, this can be any html input type
 * @option {Boolean} textarea Set to true if the input textbox should be a large textarea
 * @link http://www.w3schools.com/html/html_form_input_types.asp HTML Input Types
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

can.Component.extend({
  tag: 'date-field',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      dateSelector();
    }
  }
});
