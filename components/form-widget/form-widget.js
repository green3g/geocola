import CanMap from 'can/map/';
import stache from 'can/view/stache/';
import Component from 'can/component/';

//provides can.extend
import can from 'can/util/';

import template from './template.stache!';

let FIELD_TYPES = {
  text: '<text-field {properties}="." (change)="setField" />',
  select: '<select-field {properties}="." (change)="setField" />',
  file: '<file-field {properties}="." (change)="setField" />',
  json: '<json-field {properties}="." (change)="setField" />',
  date: '<date-field {properties}="." (change)="setField" />'
};

//precompile templates
for (var type in FIELD_TYPES) {
  if (FIELD_TYPES.hasOwnProperty(type)) {
    FIELD_TYPES[type] = stache(FIELD_TYPES[type]);
  }
}

/**
 * @constructor components/form-widget.ViewModel ViewModel
 * @parent components/form-widget
 * @group components/form-widget.ViewModel.props Properties
 * @group components/form-widget.ViewModel.events Events
 *
 * @description A `<form-widget />` component's ViewModel
 */
export let viewModel = CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Whether or not to show the submit/cancel buttons
     * @property {Boolean} components/form-widget.ViewModel.props.showButtons
     * @parent components/form-widget.ViewModel.props
     */
    showButtons: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this form should be a bootstrap inline form
     * @property {Boolean} components/form-widget.ViewModel.props.inline
     * @parent components/form-widget.ViewModel.props
     */
    inline: {
      type: 'boolean',
      value: false
    },
    /**
     * The object id of the item to retrieve. If this is provided, a request will be made to the connection object with the specified id.
     * @property {Number} components/form-widget.ViewModel.props.objectId
     * @parent components/form-widget.ViewModel.props
     */
    objectId: {
      type: 'number',
      set: function(id) {
        this.fetchObject(this.attr('connection'), id);
        return id;
      }
    },
    /**
     * An object representing a can.Map or similar object. This object should have
     * a `save` method like a `can.Model` or `can-connect.superMap`. This object is
     * updated and its `save` method is called when the form is submitted.
     * @property {can.Map} components/form-widget.ViewModel.props.formObject
     * @parent components/form-widget.ViewModel.props
     */
    formObject: {
      Value: CanMap
    },
    /**
     * The list of form fields properties. These can be specified as strings representing the field names or the object properties described in the FormFieldObject
     * @property {Array<String|geocola.types.FormFieldObject>} components/form-widget.ViewModel.props.fields
     * @parent components/form-widget.ViewModel.props
     */
    fields: {
      get: function(val) {
        if (!val || !val.length) {
          val = CanMap.keys(this.attr('formObject'));
        }
        return val.map(function(field) {
          if (typeof field === 'string') {
            return {
              name: field
            };
          }
          return field;
        });
      }
    },
    /**
     * The connection info for this form's data. If this is provided, the object will be fetched using the objectId property
     * @property {connectInfoObject} components/form-widget.ViewModel.props.connection
     * @parent components/form-widget.ViewModel.props
     */
    connection: {
      value: null
    },
    /**
     * A virtual object consisting of field names mapped to their properties. This is used by the template to format the field, and by the viewModel to format the data when the form is submitted.
     * @property {Object} components/form-widget.ViewModel.props._fieldObjects
     * @parent components/form-widget.ViewModel.props
     * @link geocola.types.FormFieldObject FormFieldObject
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
            if (newVal) {
              oldValue.attr([field.name, 'value'].join('.'), newVal);
            }
          });
          this.attr('_fieldObjects', oldValue);
          return oldValue;
        }
        var objs = new CanMap();
        fields.forEach(function(field) {
          objs.attr(field.name, can.extend(
            field.properties ? field.properties.attr() : {}, {
              name: field.name,
              alias: field.alias || self.formatField(field.name),
              template: field.template || FIELD_TYPES[field.type || 'text'],
              value: self.attr(['formObject', field.name].join('.'))
            }));
        });
        this.attr('_fieldObjects', objs);
        return objs;
      }
    }
  },
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
    this.dispatch('fieldChange', [obj]);
  },
  /**
   * @typedef {can.Event} form-widget.events.formCancel cancel
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
  template: template
});
