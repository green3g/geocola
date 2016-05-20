import template from './list-table.stache!';
import './list-table.less!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Component from 'can/component/';
import CanMap from 'can/map/';
import 'can/map/define/';
import can from 'can/util/library';

/**
 * @constructor components/list-table.ViewModel ViewModel
 * @parent components/list-table
 * @group components/list-table.ViewModel.props Properties
 *
 * @description A `<list-table />` component's ViewModel
 */
export const ViewModel = viewModel.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Optional promise or deferred object that will resolve to an object. Once
     * the promise resolves, the objects list will be replaced with the promise result
     * @parent components/list-table.ViewModel.props
     * @property {can.Deferred | Promise} components/list-table.ViewModel.props.promise
     */
    promise: {
      set(newVal) {
        var self = this;
        newVal.then(function(objects) {
          self.attr('objects').replace(objects);
        });
        return newVal;
      }
    },
    /**
     * A list of objects to display. These objects should generally be can.Model
     * objects but may be any can.Map or javascript object.
     * @parent components/list-table.ViewModel.props
     * @property {Array.<can.Model | can.Map | Object>} components/list-table.ViewModel.props.objects
     */
    objects: {
      Value: List,
      Type: List
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
      get() {
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
    },
    /**
     * An array of fields
     * @parent components/list-table.ViewModel.props
     * @property {can.List} components/list-table.ViewModel.props.fields
     */
    fields: {
      Value: List,
      Type: List,
      get(fields){
        return fields.filter(f => {
          return !f.excludeListTable;
        });
      }
    },
    /**
     * The current sort field
     * @parent components/list-table.ViewModel.props
     * @property {can.List} components/list-table.ViewModel.props.currentSort
     */
    currentSort: {
      value: function() {
        return new CanMap({
          fieldName: null,
          type: 'asc'
        });
      }
    }
  },
  /**
   * Called when a button is clicked. This dispatches the buttons event.
   * @signature
   * @param  {String} eventName The name of the event to dispatch
   * @param  {can.Map} object  The row data
   */
  buttonClick(eventName, object) {
    this.dispatch(eventName, [object]);
  },
  /**
   * Helps the template the currentSort value
   * @param  {String} field the field to set the sort on
   */
  setSort(field) {
    can.batch.start();
    if (this.attr('currentSort.fieldName') !== field) {
      this.attr('currentSort').attr({
        fieldName: field,
        type: 'asc'
      });
    } else {
      this.attr('currentSort.type', this.attr('currentSort.type') === 'asc' ? 'desc' : 'asc');
    }
    can.batch.stop();
  },
  /**
   * Toggles a row as selected or not selected
   * @signature
   * @param  {can.Map} obj The row to toggle
   */
  toggleSelected(obj) {
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
  toggleSelectAll() {
    if (this.attr('_selectedObjects').length < this.attr('objects').length) {
      this.attr('_selectedObjects').replace(this.attr('objects'));
    } else {
      this.attr('_selectedObjects').replace([]);
    }
  },
  /**
   * Determines whether or not the provided object is selected by comparing
   * it to the list of currently selected objects
   * @signature
   * @param  {can.Map | Object} obj The object to check if is selected
   * @return {Boolean}     Whether or not it is selected
   */
  isSelected(obj) {
    return this.attr('_selectedObjects').indexOf(obj) > -1;
  },
  /**
   * Returns an objects formatted value for the template
   * @param  {field} field The field object. This field object has a property
   * called  `getFormattedValue` which formats and returns a string 
   * @param  {can.Map} obj   The object to retrieve the property from
   * @return {String}       The formatted value
   */
  getFieldValue(field, obj){
    return field.getFormattedValue(obj);
  }
});

export default Component.extend({
  tag: 'list-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
