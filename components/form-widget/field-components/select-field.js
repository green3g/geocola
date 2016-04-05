import Component from 'can/component/';
import widgetModel from 'components/widget-model';

import template from './select-field.stache!';

/**
 * @typedef {selectFieldProperties} form-widget.types.selectFieldProperties selectFieldProperties
 * @parent form-widget.types
 * @option {Array.<form-widget.types.selectOptionProperty>} options An array of values and labels
 */
/**
 * @typedef {selectOptionProperty} form-widget.types.selectOptionProperty selectOptionProperty
 * @parent form-widget.types
 * @option {*} value The value of the dropdown. This is converted to a string inside the option tag.
 * @option {String} label The label to display in the select dropdown.
 */
/**
 * @page form-widget.fields.select Select
 * @parent form-widget.fields
 * @body
 * A select dropdown with options. See `selectFieldProperty` and `selectOptionProperty`.
 * @link form-widget.types.selectFieldProperty selectFieldProperty
 * @link form-widget.types.selectOptionProperty selectOptionProperty
 * # Example
```
{
name: 'op',
alias: 'is',
placeholder: 'Choose a operator',
type: 'select',
properties: {
  options: [{
    label: 'Equal to',
    value: '=='
  }, {
    label: 'Not equal to',
    value: '!='
  }, {
    label: 'Contains',
    value: 'in'
  }, {
    label: 'Does not contain',
    value: 'not_in'
  }, {
    label: 'Like',
    value: 'like'
  }]
}
},
```
 *
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
    this.dispatch('change', [value])
  }
})

Component.extend({
  tag: 'select-field',
  template: template,
  viewModel: ViewModel
});
