

import can from 'can';
//import './widget.css!';
import template from './template.stache!';
import 'components/list-table/';
import 'components/form-widget/';
import 'components/form-widget/field-components/text-field/';
import 'components/form-widget/field-components/select-field/';

let Filter = can.Map.extend({
  define: {
    val: {
      set: function(val) {
        var operator = this.attr('op');
        switch (operator) {
          case 'like':
            return '%' + val + '%';
          default:
            return val;
        }
      }
    },
    name: {
      type: 'string'
    },
    op: {
      value: 'like',
      type: 'string'
    }
  }
});

/**
 * @constructor components/filter-widget.ViewModel ViewModel
 * @parent components/filter-widget
 * @group components/filter-widget.ViewModel.props Properties
 *
 * @description A `<filter-widget />` component's ViewModel
 */
export let viewModel = can.Map.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * A list of filterObjects
     * @property {Array<geocola.types.filterObject>} components/filter-widget.ViewModel.filters
     * @parent components/filter-widget.ViewModel.props
     */
    filters: {
      Value: can.List
    },
    /**
     * The model-like object to render in the form
     * @link formFieldObject formFieldObject
     * @property {form-widget.types.formFieldObject} components/filter-widget.ViewModel.formObject
     * @parent components/filter-widget.ViewModel.props
     */
    formObject: {
      Value: Filter
    },
    /**
     * The buttonObjects to display in the list table
     * @property {Array<buttonObject>} components/filter-widget.ViewModel.buttons
     * @parent components/filter-widget.ViewModel.props
     */
    buttons: {
      value: [{
        iconClass: 'fa fa-trash',
        eventName: 'delete',
        title: 'Remove Filter'
      }]
    },
    /**
     * The fields to render in the form
     * @property {Array.<formFieldObject>} components/filter-widget.ViewModel.fields
     * @parent components/filter-widget.ViewModel.props
     */
    fields: {
      get: function() {
        var nameField = can.extend(this.attr('fieldOptions') ? {
          type: 'select',
          properties: {
            options: this.attr('fieldOptions')
          }
        } : {}, {
          name: 'name',
          alias: 'Field Name',
          placeholder: 'Enter lowercase fieldname'
        });
        var fields = new can.List();
        return [nameField, {
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
              label: 'Like',
              value: 'like'
            }]
          }
        }, {
          name: 'val',
          alias: 'Value',
          placeholder: 'Enter the filter value'
        }];
      }
    }
  },
  /**
   * Removes a filter from the list of filters
   * @param  {can.Map} scope The stache scope
   * @param  {event} dom   The dom event
   * @param  {event} event The can event
   * @param  {geocola.types.filterObject} obj   The object to remove. This is the only argument used by the function, the rest may be null.
   */
  removeFilter: function(scope, dom, event, obj) {
    let index = this.attr('filters').indexOf(obj);
    this.attr('filters').splice(index, 1);
  },
  /**
   * Adds a new filter to the list of filters in this widget
   * @param  {can.Map} scope The stache scope
   * @param  {event} dom   The dom event
   * @param  {event} event The can event
   * @param  {filterObject} obj   The object to add. This is the only argument used by the function, the rest may be null.
   */
  addFilter: function(scope, dom, event, obj) {
    this.attr('filters').push(obj);
    this.attr('formObject', new Filter());
  }
});

can.Component.extend({
  tag: 'filter-widget',
  viewModel: viewModel,
  template: template,
  events: {}
});
