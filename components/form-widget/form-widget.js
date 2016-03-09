/* jshint esnext: true */

import Map from 'can/map/';
import Component from 'can/component/';
import Stache from 'can/view/stache/';
//import './widget.css!';
import template from './template.stache!';
/**
 * @module {can.Component} form-widget
 * @parent components
  * @group form-widget.types 0 Types
  * @group form-widget.templates 1 Field Types
  * @group form-widget.parameters 2 Parameters
  * @group form-widget.events 3 Events
  * @group form-widget.static 4 Static
## Description
A configureable form widget to modify data. The form accepts a formObject property that should be an object similar to a `can.Model`. When the form is submitted, it calls the model's `save` method.

## Usage
```html
  <form-widget {form-object}="formObject" (submit)="resetPage"
   (cancel)="resetPage" {fields}="formFields" />
```
 */
/**
 * @typedef {optionItemObject} form-widget.types.optionItemObject OptionItemObject
 * @parent form-widget.types
 * @option {String} value the value that is stored in the select dropdown
 * @option {String} label The label that is displayed in the select dropdown
 */
const TEMPLATES = {
  /**
   * @typedef {textInputProperties} text text
   * @parent form-widget.templates
   * @description A simple text input field
   * @option {String} name The name of the field
   */
  text: '<input type="text" class="form-control" id="{{name}}" name="{{name}}" value="{{value}}" />',
  /**
   * @typedef {selectInputProperties} select select
   * @parent form-widget.templates
   * @description A simple select dropdown field
   * @option {String} name The name of the field
   * @option {Array.<optionItemObject>} properties.options The select dropdown options
   */
  select: [
    '<select id="{{name}}" class="form-control" name="{{name}}" value="{{value}}">',
    '{{#each properties.options}}',
    '<option value="{{value}}">{{label}}</option>',
    '{{/each}}',
    '</select>'
  ].join('')
};
/**
 * @typedef {formFieldObject} formFieldObject FormFieldObject
 * This can either be a string representing the field name or an object with the properties described below.
 * @parent form-widget.types
 * @option {String} name The name of the field property
 * @option {String} alias A label to display for the field
 * @option {String} placeholder The field placeholder to display when no text is entered
 * @option {String} type The type of field template to use.
 * @option {Object} properties Additional properties to pass to the field template. For example, `options` is a property existing in the select template
 */

export let viewModel = Map.extend({
  define: {
    /**
     * Whether or not this form should be a bootstrap inline form
     * @parent form-widget.parameters
     * @property {Boolean}
     */
    inline: {
      type: 'boolean',
      value: false
    },
    objectId: {
      type: 'number',
      set: function(id) {
        this.fetchObject(this.attr('connection'), id);
        return id;
      }
    },
    formObject: {},
    /**
     * The list of form fields properties. These can be specified as strings representing the field names or the object properties described in the formFieldObject
     * @parent form-widget.parameters
     * @property {Array.<formFieldObject>} fields
     */
    fields: {
      Type: can.List
    },
    connection: {
      value: null
    }
  },
  /**
   * Initilizes the form's field objects
   * @parent form-widget.static
   * @signature
   */
  init: function() {
    if (this.attr('formObject')) {
      this.createFields();
    }
  },
  fetchObject: function(con, id) {
    console.log(id);
    if (!con || !id) {
      return;
    }
    var self = this;
    return con.get({
      id: id
    }).then(function(obj) {
      self.attr('formObject', obj);
      self.createFields();
    });
  },
  /**
   * Creates the `fieldObjects` property.
   * @parent form-widget.static
   * @signature
   */
  createFields: function() {
    var fields = this.attr('fields');
    if (!fields) {
      fields = Map.keys(this.attr('formObject'));
    }
    var self = this;
    this.attr('fieldObjects', {});
    fields.forEach(function(field) {
      var obj;
      if (typeof field === 'string') {
        obj = {
          name: field,
          alias: self.formatField(field),
          template: Stache(TEMPLATES.text),
          properties: {},
          value: self.attr(['formObject', field].join('.'))
        };
      } else {
        obj = {
          name: field.name,
          alias: field.alias || self.formatField(field),
          template: field.template || Stache(TEMPLATES[field.type || 'text']),
          properties: field.properties || {},
          value: self.attr(['formObject', field.name].join('.'))
        };
      }
      self.attr(['fieldObjects', field.name || field].join('.'), obj);
    });
  },
  /**
   * @typedef {can.Event} formSubmitEvent submit
   * An event dispatched when the save button is clicked. The formObject is passed as an argument
   * @parent form-widget.events
   * @option {can.Model} formObject The formObject
   */
  /**
   * Called when the form is submitted. Serializes the form data and compares it to the formObject. If there are changes, the object is updated and its `save` method is called. The event `submit` is dispatched.
   * @parent form-widget.static
   * @param  {can.Map} scope The stache scope
   * @param  {HTMLFormElement} form  The submitted form object
   * @param  {can.Event} event The submit event
   * @return {Boolean} Returns false to prevent the form from actually submitting
   */
  formSubmit: function(scope, form, event) {
    var data = can.$(form).serializeArray();
    var formObject = this.attr('formObject');
    for (var i = 0; i < data.length; i++) {
      var newData = data[i];
      if (formObject.attr(newData.name) !== newData.value) {
        formObject.attr(newData.name, newData.value);
      }
    }
    formObject.save();
    this.dispatch('submit', [formObject]);
    //prevent the form from submitting
    return false;
  },
  /**
   * @typedef {can.Event} formCancelEvent cancel
   * @parent form-widget.events
   * An event dispatched when the cancel button is clicked. No arguments are passed.
   */
  /**
   * Called when the form cancel button is clicked. Dispatches the `cancel` event.
   * @parent form-widget.static
   * @signature
   */
  cancelForm: function() {
    this.dispatch('cancel');
  },
  /**
   * Determines whether this field should be rendered
   * @parent form-widget.static
   * @param  {String} fieldName The fieldname
   * @return {Boolean} True if the field is in the list of fields, false if otherwise
   */
  renderField: function(fieldName) {
    var fields = this.attr('fields');
    return true;
  },
  /**
   * Formats the field by replacing underscores with spaces and capitalizing the first letter
   * @parent form-widget.static
   * @param  {String} fieldName The name of the field
   * @return {String} The formatted field string. Example: `my_field_name` will become `My field name`.
   */
  formatField: function(fieldName) {
    fieldName = String(fieldName);
    return [fieldName.substring(0, 1).toUpperCase(), fieldName.substring(1, fieldName.length).replace(/_/g, " ")].join('');
  }
});

Component.extend({
  tag: 'form-widget',
  viewModel: viewModel,
  template: template,
  events: {
    inserted: function() {
      //
    }
  }
});
