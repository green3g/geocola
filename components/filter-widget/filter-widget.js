/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/'
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';

let Filter = Map.extend({
  name: null,
  op: 'like',
  val: null,
  save: function() { /* noop to simulate a supermodel */ }
});

export let viewModel = Map.extend({
  define: {
    visible: {
      value: false,
      type: 'boolean'
    },
    filters: {
      Value: List
    },
    formObject: {
      Value: Filter
    },
    buttons: {
      value: [{
        iconClass: 'fa fa-trash',
        eventName: 'delete',
        title: 'Remove Filter'
      }]
    },
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
  removeFilter: function(scope, dom, event, obj) {
    let index = this.attr('filters').indexOf(obj);
    this.attr('filters').splice(index, 1);
  },
  toggleVisible: function() {
    this.attr('visible', !this.attr('visible'));
  },
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
