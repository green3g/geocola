/* jshint esnext: true */

import Map from 'can/map/';
import Component from 'can/component/';
import Stache from 'can/view/stache/';
//import './widget.css!';
import template from './template.stache!';
/**
 * @module {can.Component} form-widget
 * @parent Home.components
  * @group form-widget.types 0 Types
  * @group form-widget.fields 1 Field Types
  * @group form-widget.events 3 Events
## Description
A configureable form widget to modify data. The form accepts a formObject property that should be an object similar to a `can.Map`. When the form is submitted, it calls the model's `save` method.


## Example Template
```html
  <form-widget {form-object}="formObject" (submit)="resetPage"
   (cancel)="resetPage" {fields}="formFields" />
```

## Javascript
```javascript

let Filter = Map.extend({
  name: null,
  op: 'like',
  val: null,
  save: function() {  } //noop to simulate a supermodel
});

//...
fields: {
  value: [{
    name: 'name',
    alias: 'Field name',
    placeholder: 'Enter a field name'
  }, {
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
        label: 'is like',
        value: 'like'
      }]
    }
  }, {
    name: 'val',
    alias: 'Value',
    placeholder: 'Enter the filter value'
  }]
},
formObject: {value: Filter}
//...
```
 */

const FIELD_TYPES = {
  /**
   * @page form-widget.fields.text Text
   * @parent form-widget.fields
   * @body
   * A generic text box with a label. If the `type` property is not provided, `'text'` is the default.
   *
   * `type: 'text'`
   */
  text: '<input type="text" class="form-control" id="{{name}}" name="{{name}}" value="{{value}}" />',
  /**
   * @typedef {selectFieldProperty} form-widget.types.selectFieldProperty selectFieldProperty
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
   *
   * `type: 'select'`
   */
  select: [
    '{{value}}<select id="{{name}}" class="form-control" name="{{name}}" value="{{value}}">',
    '<option value=""{{^value}} selected{{/value}}></option>',
    '{{#each properties.options}}',
    '<option value="{{value}}"{{#is value, ../value}} selected{{/is}}>{{label}}</option>',
    '{{/each}}',
    '</select>'
  ].join(''),
  /**
   * @page form-widget.fields.textarea Textarea
   * @parent form-widget.fields
   * @body
   * A generic textarea for larger input fields
   *
   * `type: 'textarea'`
   */
  textarea: [
    '<textarea id="{{name}}" class="form-control" name="{{name}}">',
    '{{value}}',
    '</textarea>'
  ].join('')
};
/**
 * @typedef {formFieldObject} form-widget.types.formFieldObject FormFieldObject
 * This can either be a string representing the field name or an object with the properties described below.
 * @parent form-widget.types
 * @option {String} name The name of the field property
 * @option {String} alias A label to display for the field
 * @option {String} placeholder The field placeholder to display when no text is entered
 * @option {String} type The type of field template to use.
 * @option {can.view.renderer} template A template partial which gets passed the formFieldObject. You can create a renderer using `can.stache(template)`, or importing the template with steal. If this is provided, the `type` will be ignored.
 * @option {Object} properties Additional properties to pass to the field template. For example, `options` is a property existing in the select template
 * @option {String} The value stored in the formObject. This is provided by the form-widget internally
 */

export let viewModel = Map.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Whether or not this form should be a bootstrap inline form
     * @property {Boolean}
     */
    inline: {
      type: 'boolean',
      value: false
    },
    objectId: {
      type: 'number',
      set: function(id) {
        this.fetchObject(this.attr('connection.connection'), id);
        return id;
      }
    },
    /**
     * An object representing a can.Map or similar object. This object should have
     * a `save` method like a `can.Model` or `can-connect.superMap`. This object is
     * updated and its `save` method is called when the form is submitted.
     * @property {can.Map}
     */
    formObject: {},
    /**
     * The list of form fields properties. These can be specified as strings representing the field names or the object properties described in the formFieldObject
     * @property {Array<String|form-widget.types.formFieldObject>} fields
     */
    fields: {
      Type: can.List
    },
    connection: {
      value: null
    },
    fieldObjects: {
      get: function() {
        if(!this.attr('formObject')){
          return {};
        }
        var objs = new can.Map({});
        var fields = this.attr('fields');
        if (!(fields && fields.length)) {
          fields = Map.keys(this.attr('formObject'));
        }
        var self = this;
        fields.forEach(function(field) {
          var obj;
          if (typeof field === 'string') {
            obj = {
              name: field,
              alias: self.formatField(field),
              template: Stache(FIELD_TYPES.text),
              properties: {},
              valueParser: null,
              value: self.attr(['formObject', field].join('.'))
            };
          } else {
            obj = {
              name: field.name,
              alias: field.alias || self.formatField(field.name),
              template: field.template || Stache(FIELD_TYPES[field.type || 'text']),
              properties: field.properties || {},
              valueParser: field.valueParser || null,
              value: self.attr(['formObject', field.name].join('.'))
            };
          }
          objs.attr(field.name || field, obj);
        });
        return objs;
      }
    }
  },
  /**
   * @prototype
   */
  fetchObject: function(con, id) {
    if (!con || !id) {
      return;
    }
    var self = this;
    return con.get({
      id: id
    }).then(function(obj) {
      self.attr('formObject', obj);
    });
  },
  /**
   * @typedef {can.Event} form-widget.events.formSubmitEvent submit
   * An event dispatched when the save button is clicked. The formObject is passed as an argument
   * @parent form-widget.events
   * @option {can.Map} formObject The formObject
   */
  /**
   * Called when the form is submitted. Serializes the form data and compares it to the formObject. If there are changes, the object is updated and its `save` method is called. The event `submit` is dispatched.
   * @param  {can.Map} scope The stache scope
   * @param  {HTMLFormElement} form  The submitted form object
   * @param  {can.Event} event The submit event
   * @return {Boolean} Returns false to prevent the form from actually submitting
   */
  formSubmit: function(scope, form, event) {

    //get the form data in an array
    var data = can.$(form).serializeArray();

    //get the form model object
    var formObject = this.attr('formObject');

    //loop through it and update the model object as necessary
    for (var i = 0; i < data.length; i++) {
      var newData = data[i];
      var valueParser = this.attr('fieldObjects.' + newData.name + '.valueParser');

      //format the field value if a valueParser exists
      var value = valueParser ? valueParser(newData.value, data) : newData.value;

      //if it changed, update the value
      if (formObject.attr(newData.name) !== value) {
        formObject.attr(newData.name, value);
      }
    }

    //save the model object
    formObject.save();
    this.dispatch('submit', [formObject]);

    //prevent the form from submitting
    return false;
  },
  /**
   * @typedef {can.Event} form-widget.events.formCancelEvent cancel
   * @parent form-widget.events
   * An event dispatched when the cancel button is clicked. No arguments are passed.
   */
  /**
   * Called when the form cancel button is clicked. Dispatches the `cancel` event.
   * @signature
   */
  cancelForm: function() {
    this.dispatch('cancel');
  },
  /**
   * Determines whether this field should be rendered
   * @signature
   * @param  {String} fieldName The fieldname
   * @return {Boolean} True if the field is in the list of fields, false if otherwise
   */
  renderField: function(fieldName) {
    var fields = this.attr('fields');
    return true;
  },
  /**
   * Formats the field by replacing underscores with spaces and capitalizing the first letter
   * @signature
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
