/* jshint esnext: true */
import template from './list-table.stache!';
import './list-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Component from 'can/component/';
/**
 * @module {can.Component} list-table
 * @parent components
  * @group list-table.types 0 Types
  * @group list-table.parameters 2 Parameters
  * @group list-table.events 3 Events
  * @group list-table.static 4 Static
## Description
A configureable form widget to modify data. The form accepts a formObject property that should be an object similar to a `can.Model`. When the form is submitted, it calls the model's `save` method.

## Usage
```html
  <list-table {form-object}="formObject" (submit)="resetPage"
   (cancel)="resetPage" {fields}="formFields" />
```
 */
/**
 * @typedef {buttonObject} buttonObject buttonObject
 * @parent list-table.types
 * @option {String} title The title to display on the button hover
 * @option {String} iconClass The class to use for the button icon
 * @option {String} eventname The event to dispatch when the button is clicked
 */

export const ViewModel = viewModel.extend({
  define: {
    /**
     * Optional promise or deferred object that will resolve to an object. Once the promise resolves, the objects list will be replaced with the promise result
     * @parent list-table.parameters
     * @property {can.Deferred | Promise}
     */
    promise: {
      set: function(newVal) {
        var self = this;
        newVal.then(function(objects) {
          self.attr('objects').replace(objects);
        });
        return newVal;
      }
    },
    /**
     * A list of objects to display. These objects should generally be can.Model objects but may be any can.Map or javascript object.
     * @parent list-table.parameters
     * @property {Array.<can.Model | can.Map | Object>}
     */
    objects: {
      Value: List,
      Type: List
    },
    /**
     * A list of the currently selected objects in the table
     * @parent list-table.parameters
     * @property {Array.<can.Map>}
     */
    selectedObjects: {
      Value: List,
      Type: List
    },
    /**
     * A virtual property that helps the template determine whether all objects are selected
     * @parent list-table.parameters
     * @property {Boolean}
     */
    allSelected: {
      type: 'boolean',
      get: function(){
        return this.attr('selectedObjects').length === this.attr('objects').length;
      }
    },
    /**
     * An array of buttonObjects
     * @parent list-table.parameters
     * @property {Array.<buttonObject>}
     */
    buttons: {
      value: List
    }
  },
  buttonClick: function(event, object) {
    this.dispatch(event.eventName, [object]);
  },
  toggleSelected: function(obj) {
    var index = this.attr('selectedObjects').indexOf(obj);
    if (index > -1) {
      this.attr('selectedObjects').splice(index, 1);
    } else {
      this.attr('selectedObjects').push(obj);
    }
  },
  toggleSelectAll: function() {
    if (this.attr('selectedObjects').length < this.attr('objects').length) {
      this.attr('selectedObjects').replace(this.attr('objects'));
    } else {
      this.attr('selectedObjects').replace([]);
    }
  },
  isSelected: function(obj) {
    return this.attr('selectedObjects').indexOf(obj) > -1;
  },
  renderField: function(fieldName) {
    return !this.attr('fields') || this.attr('fields').indexOf(fieldName) > -1;
  },
  formatField: function(fieldName) {
    fieldName = fieldName.replace(/_/g, ' ');
    return [fieldName.substring(0, 1).toUpperCase(), fieldName.substring(1, fieldName.length)].join('');
  },
  formatValue: function(value) {
    var f = this.attr('formatters');
    if (f && f[fieldName]) {
      return f[fieldName](value);
    }
    return value;
  }
});

export default Component.extend({
  tag: 'list-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
