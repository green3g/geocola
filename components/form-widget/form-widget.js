/* jshint esnext: true */

import can from 'can';
//import './widget.css!';
import template from './template.stache!';

import './field-components/text-field';
import './field-components/select-field';
import './field-components/file-field';
import './field-components/json-field';

/**
 * @module {can.Component} form-widget
 */

const FIELD_TYPES = {
  text: '<text-field {properties}="." (change)="setField" />',
  select: '<select-field {properties}="." (change)="setField" />',
  file: '<file-field {properties}="." (change)="setField" />',
  json: '<json-field {properties}="." (change)="setField" />'
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

/**
 * @typedef {can.Event} form-widget.events.formSubmitEvent submit
 * An event dispatched when the save button is clicked. The formObject is passed as an argument
 * @parent form-widget.events
 * @option {can.Map} formObject The formObject
 * @option {can.Deferred | Object} save The result of the formObject.save()
 */

export let viewModel = can.Map.extend({
  define: {
    /**
     * Whether or not to show the submit/cancel buttons
     * @property {Boolean} form-widget.props.showButtons
     * @parent form-widget.props
     */
    showButtons: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this form should be a bootstrap inline form
     * @property {Boolean} form-widget.props.inline
     * @parent form-widget.props
     */
    inline: {
      type: 'boolean',
      value: false
    },
    /**
     * The object id of the item to retrieve. If this is provided, a request will be made to the connection object with the specified id.
     * @property {Number} form-widget.props.objectId
     * @parent form-widget.props
     */
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
     * @property {can.Map} form-widget.props.formObject
     * @parent form-widget.props
     */
    formObject: {},
    /**
     * The list of form fields properties. These can be specified as strings representing the field names or the object properties described in the formFieldObject
     * @property {Array<String|form-widget.types.formFieldObject>} form-widget.props.fields
     * @parent form-widget.props
     */
    fields: {
      Type: can.List,
      get: function(val) {

        return (val.length ? val : can.Map.keys(this.attr('formObject'))).map(function(f) {
          if (typeof f === 'string') {
            return {
              name: f
            };
          }
          return f;
        });
      }
    },
    /**
     * The connection info for this form's data
     * @property {connectInfoObject} form-widget.props.connection
     * @parent form-widget.props
     */
    connection: {
      value: null
    },
    /**
     * A virtual object consisting of field names mapped to their properties. This is used by the template to format the field, and by the viewModel to format the data when the form is submitted.
     * @property {Object} form-widget.props._fieldObjects
     */
    _fieldObjects: {
      get: function(oldValue, setValue) {
        if (!this.attr('formObject')) {
          return {};
        }
        var fields = this.attr('fields');

        var self = this;
        if (oldValue) {
          fields.forEach(function(field) {
            var newVal = self.attr(['formObject', field.name].join('.'));
            oldValue.attr([field.name, 'value'].join('.'), newVal);
          });
          this.attr('_fieldObjects', oldValue);
          return oldValue;
        }
        var objs = new can.Map({});
        fields.forEach(function(field) {
          var obj;
          obj = can.extend(field.properties, {
            name: field.name,
            alias: field.alias || self.formatField(field.name),
            template: field.template || can.stache(FIELD_TYPES[field.type || 'text']),
            value: self.attr(['formObject', field.name].join('.'))
          });
          objs.attr(obj.name, obj);
        });
        this.attr('_fieldObjects', objs);
        return objs;
      }
    }
  },
  /**
   * @prototype
   */
  /**
   * Fetches and replaces the formObject with a new formObject
   * @param  {superMap} con The supermap connection to the api service
   * @param  {Number} id  The id number of the object to fetch
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
   * Called when the form is submitted. The object is updated by calling it's `save` method. The event `submit` is dispatched.
   */
  submitForm: function() {
    let formObject = this.attr('formObject');

    this.dispatch('submit', [formObject]);

  },
  /**
   * Sets the formObject value when a field changes. This will allow for future
   * functionality where the form is much more responsive to values changing, like
   * cascading dropdowns.
   * @param  {formFieldObject} field  The field object properties
   * @param  {domElement} domElement The form element that dispatched the event
   * @param  {Event} event  The event object and type
   * @param  {Object | Number | String} value  The value that was passed from the field component
   */
  setField: function(field, domElement, event, value) {
    var obj = this.attr('formObject');
    obj.attr(field.name, value);
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

can.Component.extend({
  tag: 'form-widget',
  viewModel: viewModel,
  template: template,
  events: {
    inserted: function() {
      //
    }
  }
});
