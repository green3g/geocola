/* jshint esnext: true */

import Map from 'can/map/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';

export let viewModel = Map.extend({
  define: {
    inline: {
      type: 'boolean',
      value: false
    },
    formObject: {
      value: null
    },
    templates: {
      value: {
        text: '<input type="text" id="{{%key}}" name="{{%key}}" {($value)}="{{%key}}" />',
        select: [
          '<select id="{{%key}}" name="{{%key}}" {($value)}="{{%key}}">',
          '{{#each options}}',
          '<option value="{{value}}">{{label}}</option>',
          '{{/each}}',
          '</select>'
        ].join('')
      }
    }
  },
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
  cancelForm: function(){
    this.dispatch('cancel')
  },
  renderField: function(fieldName) {
    return !this.attr('fields') ? fieldName : this.attr('fields').indexOf(fieldName) > -1;
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
