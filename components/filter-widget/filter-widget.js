/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';
import 'components/list-table/';
/**
 * @module {can.Component} filter-widget
 * @parent components
  * @group filter-widget.types Types
  * @group filter-widget.params Parameters
  * @group filter-widget.events Events
  * @group filter-widget.static Static
  * @link http://jsonapi.org/ JSON-API
 * @body
## Description

A widget with several fields that let the user filter a rest response. Uses a list-table to display the current filter objects.

The filters generated follow the JSON API specification

## Usage

  ```javascript
  import 'components/filter-widget/';
  ```
```html
  <filter-widget {(filters)}="filters" (filtersChanged)="updateFilterParam" />
  ```

 */

/**
 * @typedef {FilterObject} filter-widget.types.filterObject FilterObject
 * @parent filter-widget.types
 * @description A filter object consisting of a fieldname, operator, and a value
 * @option {String} name The name of the field
 * @option {String} op The value of the operator
 * @option {String} val The value of the search query. This can be any sql string or expression, for example `%myValue%`
 */
let Filter = Map.extend({
  name: null,
  op: 'like',
  val: null,
  save: function() { /* noop to simulate a supermodel */ }
});

export let viewModel = Map.extend({
  define: {
    /**
     * A list of filterObjects
     * @parent filter-widget.params
     * @property {Array<filter-widget.types.filterObject>}
     */
    filters: {
      Value: List
    },
    /**
     * The model-like object to render in the form
     * @parent filter-widget.params
     * @link formFieldObject formFieldObject
     * @property {form-widget.types.formFieldObject}
     */
    formObject: {
      Value: Filter
    },
    /**
     * The buttonObjects to display in the list table
     * @parent filter-widget.params
     * @property {Array<list-table.types.buttonObject>} buttons buttons
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
     * @parent filter-widget.params
     * @property {Array.<formFieldObject>}
     */
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
            label: 'Like',
            value: 'like'
          }]
        }
      }, {
        name: 'val',
        alias: 'Value',
        placeholder: 'Enter the filter value',
        valueParser: function(val, data){
          var operator;
          data.forEach(function(field){
            if(field.name === 'op'){
              operator = field.value;
            }
          });
          switch(operator){
            case 'like':
              return '%' + val + '%';
            default:
              return val;
          }
        }
      }]
    }
  },
  /**
   * Removes a filter from the list of filters
   * @param  {can.Map} scope The stache scope
   * @param  {event} dom   The dom event
   * @param  {event} event The can event
   * @param  {filterObject} obj   The object to remove. This is the only argument used by the function, the rest may be null.
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

Component.extend({
  tag: 'filter-widget',
  viewModel: viewModel,
  template: template,
  events: {}
});
