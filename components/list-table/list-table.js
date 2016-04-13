/* jshint esnext: true */
import template from './list-table.stache!';
import './list-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Component from 'can/component/';
 /**
  * @constructor components/list-table.ViewModel ViewModel
  * @parent components/list-table
  * @group components/list-table.ViewModel.props Properties
  *
  * @description A `<list-table />` component's ViewModel
  */
export const ViewModel = viewModel.extend({
  define: {
    /**
     * Optional promise or deferred object that will resolve to an object. Once the promise resolves, the objects list will be replaced with the promise result
     * @parent components/list-table.ViewModel.props
     * @property {can.Deferred | Promise} components/list-table.ViewModel.props.promise
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
     * @parent components/list-table.ViewModel.props
     * @property {Array.<can.Model | can.Map | Object>} components/list-table.ViewModel.props.objects
     */
    objects: {
      Value: List,
      Type: List,
      set: function(val) {
        if (this.attr('_selectedObjects')) {
          this.attr('_selectedObjects').replace([]);
        }
        return val;
      }
    },
    /**
     * A list of the currently selected objects in the table
     * @parent components/list-table.ViewModel.props
     * @property {Array.<can.Map>} components/list-table.ViewModel.props._selectedObjects
     */
    _selectedObjects: {
      Value: List,
      Type: List
    },
    /**
     * A virtual property that helps the template determine whether all objects are selected
     * @parent components/list-table.ViewModel.props
     * @property {Boolean} components/list-table.ViewModel.props._allSelected
     */
    _allSelected: {
      type: 'boolean',
      get: function() {
        return this.attr('_selectedObjects').length === this.attr('objects').length;
      }
    },
    /**
     * An array of buttonObjects
     * @parent components/list-table.ViewModel.props
     * @property {Array.<geocola.types.TableButtonObject>} components/list-table.ViewModel.props.buttons
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
   * @signature
   * @param  {String} eventName The name of the event to dispatch
   * @param  {can.Map} object  The row data
   */
  buttonClick: function(eventName, object) {
    this.dispatch(eventName, [object]);
  },
  /**
   * Toggles a row as selected or not selected
   * @signature
   * @param  {can.Map} obj The row to toggle
   */
  toggleSelected: function(obj) {
    var index = this.attr('_selectedObjects').indexOf(obj);
    if (index > -1) {
      this.attr('_selectedObjects').splice(index, 1);
    } else {
      this.attr('_selectedObjects').push(obj);
    }
  },
  /**
   * Selects or unselects all of the objects in the table
   * @signature
   */
  toggleSelectAll: function() {
    if (this.attr('_selectedObjects').length < this.attr('objects').length) {
      this.attr('_selectedObjects').replace(this.attr('objects'));
    } else {
      this.attr('_selectedObjects').replace([]);
    }
  },
  /**
   * Determines whether or not the provided object is selected by comparing it to the list of currently selected objects
   * @signature
   * @param  {can.Map | Object} obj The object to check if is selected
   * @return {Boolean}     Whether or not it is selected
   */
  isSelected: function(obj) {
    return this.attr('_selectedObjects').indexOf(obj) > -1;
  },
  /**
   * Determines whether or not the field should be rendered by checking wheter or not the field is in the list of fields if the property exists
   * @signature
   * @param  {String} fieldName The name of the field to check
   * @return {Boolean}           Whether or not to render the field
   */
  renderField: function(fieldName) {
    return !this.attr('fields') || this.attr('fields').indexOf(fieldName) > -1;
  },
  /**
   * Formats the field into a pretty readable name by removing underscores and capitalizing the first letter
   * @signature
   * @param  {String} fieldName The field name to format
   * @return {String}           The pretty title
   */
  formatField: function(fieldName) {
    fieldName = fieldName.replace(/_/g, ' ');
    return [fieldName.substring(0, 1).toUpperCase(), fieldName.substring(1, fieldName.length)].join('');
  },
  /**
   * Formats the field value using the `formatters` object property if provided
   * @signature
   * @param  {String} value The value to format
   * @return {String}       The formatted value if a formatter exists
   */
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
