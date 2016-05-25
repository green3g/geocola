import List from 'can/list/';
import CanMap from 'can/map/';
import can from 'can/util/library';
import 'can/map/define/';
import Component from 'can/component/';
import { makeSentenceCase } from '../../util/string';
//import './widget.css!';
import template from './template.stache!';
import '../list-table/';
import '../form-widget/';
import '../form-widget/field-components/text-field/';
import '../form-widget/field-components/select-field/';
import { parseFieldArray } from '../../util/field';

export const FilterOptions = [{
  label: 'Equal to',
  operator: 'equals',
  value: 'equals',
  types: ['string', 'number', 'boolean', 'date']
}, {
  label: 'Not equal to',
  operator: 'not_equal_to',
  value: 'not_equal_to',
  types: ['string', 'number', 'boolean', 'date']
}, {
  label: 'Contains',
  operator: 'like',
  value: 'like',
  types: ['string']
}, {
  label: 'Does not contain',
  operator: 'not_like',
  value: 'not_like',
  types: ['string']
}, {
  label: 'Greater Than',
  operator: '>',
  value: 'greater_than',
  types: ['number']
}, {
  label: 'Less Than',
  operator: '<',
  value: 'less_than',
  types: ['number']
}, {
  label: 'Before',
  operator: '<',
  value: 'before',
  types: ['date']
}, {
  label: 'After',
  operator: '>',
  value: 'after',
  types: ['date']
}];

export const Filter = can.Map.extend({
  define: {
    val: {
      set: function(val) {
        switch (this.attr('op')) {
          case 'like':
            if (val.indexOf('%') === -1) {
              val = '%' + val + '%';
            }
            return val;
          case '>':
          case '<':
            try {
              return parseFloat(val);
            } catch (e) {
              console.warn(e);
              return val;
            }
            break;
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
      type: 'string',
      set(val) {
        return FilterOptions.filter(function(o) {
          return o.value === val;
        })[0].operator;
      }
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
export let ViewModel = CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * A list of filterObjects currently used in this widget
     * @property {Array<geocola.types.filterObject>} components/filter-widget.ViewModel.filters
     * @parent components/filter-widget.ViewModel.props
     */
    filters: {
      Value: List
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
     * The buttonObjects to display in the list table. This widget only uses
     * a "Remove Filter" button
     * @property {Array<buttonObject>} components/filter-widget.ViewModel.buttons
     * @parent components/filter-widget.ViewModel.props
     */
    buttons: {
      value: [{
        iconClass: 'fa fa-times',
        eventName: 'delete',
        title: 'Remove Filter'
      }]
    },
    /**
     * An optional object template to derive field options from. If it is provided,
     * filter-widget will extract the field names and the field types and use that to create
     * filter options.
     * @property {can.Map} components/filter-widget.ViewModel.objectTemplate
     * @parent components/filter-widget.ViewModel.props
     */
    objectTemplate: {
      value: null
    },
    /**
     * The fields to render in the form. These fields are:
     * * name - the field name, which can be either a text field or select dropdown depending on the configuration
     * * op - the operator to filter the field by (like, eq, etc)
     * * val - the value to filter the field by
     * @property {Array.<formFieldObject>} components/filter-widget.ViewModel.fields
     * @parent components/filter-widget.ViewModel.props
     */
    formFields: {
      get: function(fields) {
        let nameField = this.attr('fieldOptions') ? {
          formatter: makeSentenceCase,
          name: 'name',
          alias: 'Field Name',
          type: 'select',
          properties: {
            options: this.attr('fieldOptions')
          }
        } : {
          name: 'name',
          alias: 'Field Name',
          placeholder: 'Enter fieldname'
        };
        return parseFieldArray([nameField, {
          name: 'op',
          alias: 'is',
          placeholder: 'Choose an operator',
          type: 'select',
          properties: {
            options: this.attr('filterOptions')
          }
        }, {
          name: 'val',
          alias: 'Value',
          placeholder: 'Enter the filter value'
        }]);
      }
    },
    /**
     * A getter for the filter operators that changes based on the selected field and
     * the selected field's type. The value may be filtered based on
     * 1. If there is a `dataType` property on the field that matches the name of the dropdown
     * 2. 2f there is a defined type in the define property for the current filter field dropdown
     * If a type is found using the rules above, the returned value will be filtered to only include
     * operators for the given type.
     * @property {Array<geocola.types.SelectOptionProperty>} components/filter-widget.ViewModel.filterOptions
     * @parent components/filter-widget.ViewModel.props
     */
    filterOptions: {
      get: function() {
        //get the name of the selected field
        let name = this.attr('formObject.name');
        let fields = this.attr('fields');

        //if we have fields search them for a dataType matching the name
        //of the selected field name
        if (fields) {
          let field = fields.filter(f => {
            return f.attr('name') === name;
          })[0];
          if (field && field.attr('dataType')) {
            return FilterOptions.filter(f => {
              return f.types.indexOf(field.attr('dataType')) !== -1;
            });
          }
        }

        //otherwise search the objectTemplate for a field type
        //if it doesn't exist or the property/type doesn't exist then
        //return the whole array
        let map = this.attr('objectTemplate');
        if (!map ||
          !map.prototype.define ||
          !map.prototype.define[name] ||
          !map.prototype.define[name].type) {
          return FilterOptions;
        }
        let type = map.prototype.define[name].type;
        return FilterOptions.filter(f => {
          return f.types.indexOf(type) !== -1;
        });
      }
    },
    /**
     * A list of fields that will be used to create options in the field name
     * dropdown. Each field may have a property `filterFactory` which may return
     * one or more filter objects
     * @property {List} components/filter-widget.ViewModel.fields
     * @parent components/filter-widget.ViewModel.props
     */
    fields: {
      value: null,
      get(fields){
        if(fields){
          return fields.filter(f => {
            return !f.excludeFilter;
          });
        }
      }
    },
    /**
     * An array of field options to display for the field selection dropdown. If not provided, the
     * viewModel will look for the objectTemplate property and display its keys. If this property does
     * not exist, the fieldOptions will be replaced with a simple text field.
     * @property {Array<geocola.types.SelectOptionProperty>} components/filter-widget.ViewModel.fieldOptions
     * @parent components/filter-widget.ViewModel.props
     */
    fieldOptions: {
      value: null,
      get: function() {
        if (this.attr('fields')) {
          return this.attr('fields').map(f => {
            return {
              value: f.attr('name'),
              label: f.attr('alias')
            };
          });
        }
        return this.attr('objectTemplate') ? CanMap.keys(this.attr('objectTemplate')()).map(key => {
          return {
            value: key,
            label: makeSentenceCase(key)
          };
        }) : null;
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
   * Adds a new filter or set of filters to the list of filters in this widget.
   * A `filterFactory` may be defined on the field which may return on or several
   * filters.
   * @param  {can.Map} scope The stache scope
   * @param  {event} dom   The dom event
   * @param  {event} event The can event
   * @param  {filterObject} obj The object to add. This is the only argument used by the function, the rest may be null.
   */
  addFilter: function(scope, dom, event, obj) {
    let name = obj.attr('name');
    let filters;
    if (!name) {
      return false;
    }
    let fields = this.attr('fields');
    if (fields) {
      let field = this.attr('fields').filter(f => {
        return f.name === name;
      })[0];
      if (field.filterFactory) {
        filters = field.filterFactory(obj);
      } else {
        filters = [obj];
      }
    } else {
      filters = [obj];
    }
    filters.forEach(f => {
      this.attr('filters').push(f);
    });
    this.attr('formObject', new Filter({}));

    return false;
  }
});

Component.extend({
  tag: 'filter-widget',
  viewModel: ViewModel,
  template: template,
  events: {}
});
