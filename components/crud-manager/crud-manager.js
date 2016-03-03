/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';
import {
  FlaskConnectFactory
} from 'models/FlaskModelFactory';

import 'components/list-table/';
import 'components/property-table/';
import 'components/form-widget/';
import 'components/filter-widget/';

export let viewModel = Map.extend({
  define: {
    connection: {
      value: null
    },
    editable: {
      type: 'boolean',
      value: false
    },
    page: {
      type: 'string',
      value: 'all'
    },
    parameters: {
      Value: Map
    },
    promise: {
      get: function(prev, setAttr) {
        return this.attr('connection.connection').getList(this.attr('parameters').attr());
      }
    },
    buttons: {
      type: '*',
      value: [{
        iconClass: 'fa fa-pencil',
        eventName: 'edit',
        title: 'Edit Row'
      }, {
        iconClass: 'fa fa-trash',
        eventName: 'delete'
      }, {
        iconClass: 'fa fa-list-ul',
        eventName: 'view'
      }]
    }
  },
  editObject: function(scope, dom, event, object) {
    this.attr('formObject', object);
    this.attr('page', 'edit');
  },
  viewObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('connection.connection').id(obj));
    this.attr('page', 'details');
  },
  resetPage: function() {
    this.attr('page', 'all');
  },
  createObject: function() {
    var newObject = this.attr('connection.map')();
    this.attr('formObject', newObject);
    this.attr('page', 'edit');
  },
  deleteObject: function(scope, dom, event, obj, skipConfirm) {
    if (obj && (skipConfirm || confirm('Are you sure you want to delete this record?'))) {
      obj.destroy();
    }
  },
  deleteMultiple: function() {
    var self = this;
    if (confirm('Are you sure you want to delete the selected records?')) {
      this.attr('selectedObjects').forEach(function(obj) {
        self.deleteObject(null, null, null, obj, true);
      });
      this.attr('selectedObjects').replace([]);
    }
  },
  updateFilterParam: function(scope, dom, event, filters) {
    if (filters.length) {
      this.removeAttr('parameters.page');
      this.attr('parameters.q', JSON.stringify({
        filters: filters.attr()
      }));
    } else {
      this.removeAttr('parameters.q');
    }
    console.log(this.attr('parameters'));
  }
});

Component.extend({
  tag: 'crud-manager',
  viewModel: viewModel,
  template: template
});
