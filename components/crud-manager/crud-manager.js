/* jshint esnext: true */

import CanMap from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import Route from 'can/route/';

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
import 'components/modal-container/';

const DEFAULT_BUTTONS = [{
  iconClass: 'fa fa-list-ul',
  eventName: 'view'
}];
const EDIT_BUTTONS = DEFAULT_BUTTONS.concat([{
  iconClass: 'fa fa-pencil',
  eventName: 'edit',
  title: 'Edit Row'
}, {
  iconClass: 'fa fa-trash',
  eventName: 'delete'
}]);

export let viewModel = CanMap.extend({
  define: {
    view: {
    },
    parameters: {
      set: function(val) {
        return val;
      },
      Value: CanMap,
      Type: CanMap
    },
    page: {
      value: 'all',
      type: 'string'
    },
    totalPages: {
      get: function(val, setAttr) {
        //round up to the nearest integer
        var pages = Math.ceil(this.attr('view.connectionProperties.totalItems') / this.attr('queryPerPage'));
        return pages;
      }
    },
    promise: {
      get: function(prev, setAttr) {
        return this.attr('view.connection').getList(this.attr('parameters').attr());
      }
    },
    buttons: {
      type: '*',
      get: function() {
        return this.attr('view.disableEdit') ? DEFAULT_BUTTONS : EDIT_BUTTONS;
      }
    },
    queryFilters: {
      Value: List
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
    },
    progress: {
      type: 'number',
      value: 100
    },
    errors: {
      Value: List
    },
    filterVisible: {
      type: 'boolean',
      value: false
    }
  },
  init: function() {
    var params = this.attr('parameters');
    can.batch.start();
    params.attr('page[size]', this.attr('queryPerPage'));
    params.attr('page[number]', this.attr('queryPerPage'));
    this.setFilterParameter(this.attr('queryFilters'));
    can.batch.stop();
  },
  editObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('view.connection').id(obj));
    this.attr('focusObject', obj);
    this.attr('page', 'edit');
  },
  viewObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('view.connection').id(obj));
    this.attr('focusObject', obj);
    this.attr('page', 'details');
  },
  saveObject: function(scope, dom, event, obj) {
    var self = this;
    this.attr('progress', 100);
    this.attr('page', 'loading');
    var deferred = this.attr('view.connection').save(obj);
    deferred.then(function(result) {

      //reset error messages
      self.attr('errors').replace([]);

      //update the view id
      self.attr('viewId', result.attr('id'));

      //set page to the details view by default
      self.attr('page', 'details');
    }).fail(function(e) {
      console.warn(e);
      self.attr('errors').push({
        message: 'Saving the object failed',
        error: e.statusText,
        level: 'danger'
      });
      self.attr('page', 'all');
    });
  },
  removeError: function(e) {
    var index = this.attr('errors').indexOf(e);
    this.attr('errors').splice(index, 1);
  },
  resetPage: function() {
    this.attr('page', 'all');
    this.attr('focusObject', null);
    this.attr('viewId', 0);
  },
  createObject: function() {
    this.attr('page', 'add');
  },
  getNewObject(){
    //create a new empty object with the defaults provided
    //from the template property which is a map
    return this.attr('view.template')();
  },
  deleteObject: function(scope, dom, event, obj, skipConfirm) {
    if (obj && (skipConfirm || confirm('Are you sure you want to delete this record?'))) {
      this.attr('view.connection').destroy(obj);
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
    if (filters && filters.length) {
      //if there are filters in the list, set the filter parameter
      params.attr('filter[objects]', JSON.stringify(filters.attr()));
    } else {
      //remove the filter parameter
      params.removeAttr('filter[objects]');
    }
  },
  toggleFilter: function(val){
    if(typeof val !== 'undefined'){
      this.attr('filterVisible', val);
    } else {
      this.attr('filterVisible', !this.attr('filterVisible'));
    }
  },
  isListTable(){
    return this.attr('view.listType') !== 'property-table';
  }
});

Component.extend({
  tag: 'crud-manager',
  viewModel: viewModel,
  template: template,
  events: {
    //bind to the change event of the entire list
    '{viewModel.queryFilters} change': function(filters) {
      this.viewModel.setFilterParameter(filters);
    }
  }
});
