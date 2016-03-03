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
  save: function(){/* noop to simulate a supermodel */}
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
      value: {
        op: {
          type: 'select',
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
          }]
        }
      }
    }
  },
  removeFilter: function(scope, dom, event, obj){
    let index = this.attr('filters').indexOf(obj);
    this.attr('filters').splice(index, 1);
    this.filtersChanged();
  },
  toggleVisible: function(){
    this.attr('visible', !this.attr('visible'));
  },
  addFilter: function(scope, dom, event, obj){
    this.attr('filters').push(obj);
    this.attr('formObject', new Filter());
    this.filtersChanged();
  },
  filtersChanged: function(){
    this.dispatch('filtersChanged', [this.attr('filters')])
  }
});

Component.extend({
  tag: 'filter-widget',
  viewModel: viewModel,
  template: template,
  events: {}
});
