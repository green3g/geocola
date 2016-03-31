/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';
import {
  FlaskConnectFactory
} from 'providers/api/FlaskModelFactory';

import 'components/list-table/';
import 'components/property-table/';
import 'components/form-widget/';
import 'components/filter-widget/';
import 'components/paginate-widget/';

export let viewModel = Map.extend({
  define: {
    connection: {
      value: null
    },
    editable: {
      type: 'boolean',
      value: false
    },
    parameters: {
      set: function(val) {
        console.log('params set', val);
        return val;
      },
      Value: Map,
      Type: Map
    },
    page: {
      value: 'all',
      type: 'string'
    },
    totalItems: {
      type: 'number'
    },
    totalPages: {
      get: function(val, setAttr) {
        var total = this.attr('connection.properties.meta.total');
        this.attr('totalItems', total);
        var pages = parseInt(total / this.attr('queryPerPage'));
        return pages;
      }
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
    },
    editFields: {
      value: null
    },
    tableFields: {
      value: null
    },
    detailFields: {
      value: null
    },
    queryFilters: {
      Value: List,
      set: function(filters) {
        var params = this.attr('parameters');
        if (!params) {
          return filters;
        }
        this.setFilterParameter(filters);
        return filters
      }
    },
    queryPage: {
      type: 'number',
      value: 0,
      set: function(page) {
        var params = this.attr('parameters');
        if (!params) {
          return page;
        }
        params.attr('page[number]', page + 1);
        return page;
      }
    },
    queryPerPage: {
      type: 'number',
      value: 10,
      set: function(perPage) {
        var params = this.attr('parameters');
        if (!params) {
          return perPage;
        }
        params.attr('page[size]', perPage);
        return perPage;
      }
    },
    viewId: {
      type: 'number',
      value: 0
    }
  },
  init: function() {
    var params = this.attr('parameters');
    params.attr('page[size]', this.attr('queryPerPage'));
    params.attr('page[number]', this.attr('queryPerPage'));
    this.setFilterParameter(this.attr('queryFilters'));
  },
  editObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('connection.connection').id(obj));
    this.attr('focusObject', obj);
    this.attr('page', 'edit');
  },
  viewObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('connection.connection').id(obj));
    this.attr('focusObject', obj);
    this.attr('page', 'details');
  },
  resetPage: function() {
    this.attr('page', 'all');
    this.attr('focusObject', null);
    this.attr('viewId', 0);
  },
  createObject: function() {
    //create a new empty object with the defaults provided
    //from the connection.map property which is a special map
    var newObject = this.attr('connection.map')();
    this.attr('newObject', newObject);
    this.attr('page', 'add');
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
  setSort: function(scope, dom, event, fieldName) {
    var sort = this.attr('parameters.sort');
    if (sort && sort.indexOf(fieldName) !== -1) {
      if (sort.indexOf('-') > 0) {
        this.attr('parameters.sort', fieldName);
      } else {
        this.attr('parameters.sort', '-' + fieldName);
      }
    } else {
      this.attr('parameters.sort', fieldName);
    }
  },
  setFilterParameter: function(filters) {
    var params = this.attr('parameters');
    //reset the page filter
    this.attr('queryPage', 0);
    if (filters.length) {
      //if there are filters in the list, set the filter parameter
      params.attr('filter[objects]', JSON.stringify(filters.attr()));
    } else {
      //remove the filter parameter
      params.removeAttr('filter[objects]');
    }
  }
});

Component.extend({
  tag: 'crud-manager',
  viewModel: viewModel,
  template: template
});
