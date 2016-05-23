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
    fields: {
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
          placeholder: 'Choose a operator',
          type: 'select',
          properties: {
            options: FilterOptions
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
     * the selected field's type. The value may be filtered based on the following:
     * 1. If there is a type set on the current filter field dropdown
     * 2. If there is a defined type in the define property for the current filter field dropdown
     * If a type is found using the rules above, the returned value will be filtered to only include
     * operators for the given type.
     * @property {Array<geocola.types.SelectOptionProperty>} components/filter-widget.ViewModel.filterOptions
     * @parent components/filter-widget.ViewModel.props
     */
    filterOptions: {
      get: function() {
        let selectedField = this.attr('formObject.name');
        if (!(selectedField && (this.attr('fieldOptions') || this.attr('objectTemplate')))) {
          return FilterOptions;
        }
        let selectedOption = this.attr('fieldOptions').filter(function(f) {
          return f.value === selectedField;
        })[0];
        let type = selectedOption.type ||
          ((this.attr('objectTemplate') &&
              this.attr('objectTemplate').prototype.define &&
              this.attr('objectTemplate').prototype.define.hasOwnProperty(selectedField)) ?
            this.attr('objectTemplate').prototype.define[selectedField].type : null);

        if (!type) {
          return FilterOptions;
        }

        return FilterOptions.filter(function(f) {
          return f.types.indexOf(type) > -1;
        });
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
      get: function(val) {
        return val || (this.attr('objectTemplate') ? CanMap.keys(this.attr('objectTemplate')()).map(function(key) {
          return {
            value: key,
            label: makeSentenceCase(key)
          };
        }) : null);
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
   * @param  {filterObject} obj The object to add. This is the only argument used by the function, the rest may be null.
   */
  addFilter: function(scope, dom, event, obj) {
    this.attr('filters').push(obj);
    this.attr('formObject', new Filter({}));
  }
});

Component.extend({
  tag: 'filter-widget',
  viewModel: ViewModel,
  template: template,
  events: {}
});
