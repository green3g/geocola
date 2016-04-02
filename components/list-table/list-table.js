/* jshint esnext: true */
import template from './list-table.stache!';
import './list-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Component from 'can/component/';

/**
 * @typedef {buttonObject} list-table.types.buttonObject buttonObject
 * @parent list-table.types
 * @option {String} title The title to display on the button hover
 * @option {String} iconClass The class to use for the button icon
 * @option {String} eventName The event to dispatch when the button is clicked. This allows developers to bind functions to custom events, like `(eventName)="functionName"`
 */

export const ViewModel = viewModel.extend({
  define: {
    /**
     * Optional promise or deferred object that will resolve to an object. Once the promise resolves, the objects list will be replaced with the promise result
     * @parent list-table.props
     * @property {can.Deferred | Promise} list-table.props.promise
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
     * @parent list-table.props
     * @property {Array.<can.Model | can.Map | Object>} list-table.props.objects
     */
    objects: {
      Value: List,
      Type: List
    },
    /**
     * A list of the currently selected objects in the table
     * @parent list-table.props
     * @property {Array.<can.Map>} list-table.props.selectedObjects
     */
    selectedObjects: {
      Value: List,
      Type: List
    },
    /**
     * A virtual property that helps the template determine whether all objects are selected
     * @parent list-table.props
     * @property {Boolean} list-table.props._allSelected
     */
    _allSelected: {
      type: 'boolean',
      get: function(){
        return this.attr('selectedObjects').length === this.attr('objects').length;
      }
    },
    /**
     * An array of buttonObjects
     * @parent list-table.props
     * @property {Array.<list-table.types.buttonObject>} list-table.props.buttons
     */
    buttons: {
      value: List
    }
  },
  /**
   * @prototype
   */
  /**
   * Called when a button is clicked. This dispatches the buttons event.
   * @param  {String} eventName The name of the event to dispatch
   * @param  {can.Map} object  The row data
   */
  buttonClick: function(eventName, object) {
    this.dispatch(eventName, [object]);
  },
  /**
   * Toggles a row as selected or not selected
   * @param  {can.Map} obj The row to toggle 
   */
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
