/* jshint esnext: true */

import Map from 'can/map/';
import Component from 'can/component/';
import Stache from 'can/view/stache/';
//import './widget.css!';
import template from './template.stache!';

const FIELD_TYPES = {
  text: '<input type="text" class="form-control" id="{{name}}" name="{{name}}" value="{{value}}" />',
  select: [
    '<select id="{{name}}" class="form-control" name="{{name}}" value="{{value}}">',
    '{{#each properties.options}}',
    '<option value="{{value}}">{{label}}</option>',
    '{{/each}}',
    '</select>'
  ].join('')
};

export let viewModel = Map.extend({
  define: {
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
    formObject: {},
    fields: {
      Type: can.List
    },
    connection: {
      value: null
    }
  },
  init: function() {
    if (this.attr('formObject')) {
      this.createFields();
    }
  },
  fetchObject: function(con, id) {
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
          template: Stache(FIELD_TYPES['text']),
          properties: {},
          formatter: null,
          value: self.attr(['formObject', field].join('.'))
        };
      } else {
        obj = {
          name: field.name,
          alias: field.alias || self.formatField(field.name),
          template: field.template || Stache(FIELD_TYPES[field.type || 'text']),
          properties: field.properties || {},
          formatter: field.formatter || null,
          value: self.attr(['formObject', field.name].join('.'))
        };
      }
      self.attr(['fieldObjects', field.name || field].join('.'), obj);
    });
  },
  formSubmit: function(scope, form, event) {

    //get the form data in an array
    var data = can.$(form).serializeArray();

    //get the form model object
    var formObject = this.attr('formObject');

    //loop through it and update the model object as necessary
    for (var i = 0; i < data.length; i++) {
      var newData = data[i];
      var formatter = this.attr('fieldObjects.' + newData.name + '.formatter');

      //format the field value if a formatter exists
      var value = formatter ? formatter(newData.value, data) : newData.value;

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
  cancelForm: function() {
    this.dispatch('cancel')
  },
  getAttr: function() {
    //trim off the last argument
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    //capture the oject and remove it
    var obj = args[0];
    args.splice(0, 1);
    //return the value
    return obj.attr(args.join('.'));
  },
  /**
   * Determines whether this field should be rendered
   * @param  {String} fieldName The fieldname
   * @return {Boolean} True if the field is in the list of fields, false if otherwise
   */
  renderField: function(fieldName) {
    var fields = this.attr('fields');
    return true;
  },
  getField: function(fieldName) {
    return {
      alias: fieldProps.attr('alias') || fieldName,
      template: Stache(TEMPLATES[fieldProps.attr('template') || 'text'])
    };
  },
  getTemplate: function(fieldName) {
    var template = this.attr('fieldTemplates.' + fieldName) || {};
    var properties = template.properties || {};
    properties.key = fieldName;
    return template.template || Stache(TEMPLATES[template.name || 'text']);
  },
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
