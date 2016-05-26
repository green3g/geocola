import can from 'can/util/library';
import CanMap from 'can/map/';
import 'can/map/define/';
import List from 'can/list/';
import Component from 'can/component/';
import Route from 'can/route/';
import template from './template.stache!';

import '../list-table/';
import '../property-table/';
import '../form-widget/';
import '../filter-widget/';
import '../paginate-widget/';
import '../modal-container/';
import '../tab-container/';
import '../panel-container/';

import { Filter } from '../filter-widget/';
import { ADD_MESSSAGE_TOPIC, CLEAR_MESSAGES_TOPIC } from '../../util/topics';
import { Message } from '../alert-widget/message';
import { mapToFields, parseFieldArray } from '../../util/field';
import PubSub from 'pubsub-js';

const DEFAULT_BUTTONS = [{
  iconClass: 'fa fa-list-ul',
  eventName: 'view',
  title: 'View Row Details'
}];
const EDIT_BUTTONS = DEFAULT_BUTTONS.concat([{
  iconClass: 'fa fa-pencil',
  eventName: 'edit',
  title: 'Edit Row'
}, {
  iconClass: 'fa fa-trash',
  eventName: 'delete',
  title: 'Remove Row'
}]);
/**
 * @module components/crud-manager
 */

/**
 * @constructor components/crud-manager.ViewModel ViewModel
 * @parent components/crud-manager
 * @group components/crud-manager.ViewModel.props Properties
 *
 * @description A `<crud-manager />` component's ViewModel
 */
export let ViewModel = CanMap.extend({
  define: {
    /**
     * The view object for this crud-manager
     * @property {can.Map} components/crud-manager.ViewModel.props.view
     * @parent components/crud-manager.ViewModel.props
     */
    view: {},
    /**
     * A set of key:string values that correspond to filter parameters for the
     * current view
     * @property {can.Map} components/crud-manager.ViewModel.props.parameters
     * @parent components/crud-manager.ViewModel.props
     */
    parameters: {
      Value: CanMap,
      Type: CanMap
    },
    /**
     * The current page to display in this view. Options include:
     * * `all`: The list table page that displays all records
     * * `details`: The individual view page that shows one detailed record
     * * `edit`: The editing view that allows editing of an individual record using a form
     * @property {String} components/crud-manager.ViewModel.props.page
     * @parent components/crud-manager.ViewModel.props
     */
    page: {
      value: 'all',
      type: 'string'
    },
    /**
     * A virtual property that calculates the number of total pages to show
     * on the list page. This controls the paginator widget. It uses the property
     * `view.connectionProperties.totalItems`  and `queryPerPage` to perform this calculation.
     * @property {String} components/crud-manager.ViewModel.props.totalPages
     * @parent components/crud-manager.ViewModel.props
     */
    totalPages: {
      get(val, setAttr) {
        //round up to the nearest integer
        return Math.ceil(this.attr('view.connectionProperties.totalItems') /
          this.attr('queryPerPage'));
      }
    },
    /**
     * A helper to show or hide the paginate-widget. If totalPages is less than
     * 2, the paginate widget will not be shown.
     * @property {Boolean} components/crud-manager.ViewModel.props.showPaginate
     * @parent components/crud-manager.ViewModel.props
     */
    showPaginate: {
      type: 'boolean',
      get() {
        return this.attr('totalPages') > 1;
      }
    },
    /**
     * A promise that resolves to the objects retrieved from a can-connect.getList call
     * @property {Promise} components/crud-manager.ViewModel.props.objects
     * @parent components/crud-manager.ViewModel.props
     */
    objects: {
      get(prev, setAttr) {
        var promise = this.attr('view.connection').getList(this.attr('parameters').serialize());
        promise.catch(function(err) {
          console.error('unable to complete objects request', err);
        });
        return promise;
      }
    },
    /**
     * A promise that resolves to the object retreived from a `can-connect.get` call
     * @property {can.Map} components/crud-manager.ViewModel.props.focusObject
     * @parent components/crud-manager.ViewModel.props
     */
    focusObject: {
      get(prev, setAttr) {
        if (this.attr('viewId')) {
          var params = {};
          params[this.attr('view.connection').idProp] = this.attr('viewId');
          var promise = this.attr('view.connection').get(params);
          promise.catch(function(err) {
            console.error('unable to complete focusObject request', err);
          });
          return promise;
        }
        return null;
      }
    },
    /**
     * Buttons to use for the list table actions. If `view.disableEdit` is falsey
     * the buttons will include an edit and delete button. Otherwise, it will be
     * a simple view details button.
     * @property {Array<geocola.types.TableButtonObject>} components/crud-manager.ViewModel.props.buttons
     * @parent components/crud-manager.ViewModel.props
     */
    buttons: {
      type: '*',
      get() {
        return this.attr('view.disableEdit') ? DEFAULT_BUTTONS : EDIT_BUTTONS;
      }
    },
    /**
     *
     * @type {Object}
     */
    queryFilters: {
      Value: List
    },
    queryPage: {
      type: 'number',
      value: 0,
      set(page, set) {
        var params = this.attr('parameters');
        if (!params) {
          return page;
        }
        params.attr('page[number]', page + 1);
        return page;
      }
    },
    queryPageNumber: {
      get() {
        return this.attr('queryPage') + 1;
      }
    },
    queryPerPage: {
      type: 'number',
      value: 10,
      set(perPage) {
        var params = this.attr('parameters');
        if (!params) {
          return perPage;
        }
        params.attr('page[size]', perPage);
        return perPage;
      }
    },
    sort: {
      Value: CanMap
    },
    viewId: {
      type: 'number',
      value: 0
    },
    progress: {
      type: 'number',
      value: 100
    },
    filterVisible: {
      type: 'boolean',
      value: false
    },
    _fields: {
      get() {

        //try a fields propety first
        if (this.attr('view.fields')) {
          return parseFieldArray(this.attr('view.fields'));
        }

        //if that doesn't exist, use the objectTemplate to create fields
        return mapToFields(this.attr('view.objectTemplate'));
      }
    }
  },
  init() {
    can.batch.start();

    //set up view's filters
    if (this.attr('view.queryFilters')) {
      this.attr('view.queryFilters').forEach(f => {
        this.attr('queryFilters').push(new Filter(f));
      });
    }

    //set up related filters
    if (this.attr('relatedField') && this.attr('relatedValue')) {
      let f = new Filter({
        name: this.attr('relatedField'),
        operator: 'equals',
        val: this.attr('relatedValue')
      });
      this.attr('queryFilters').push(f);
    }

    //set the parameters correctly
    this.setFilterParameter(this.attr('queryFilters'));
    can.batch.stop();
  },
  editObject(scope, dom, event, obj) {
    this.attr('viewId', this.attr('view.connection').id(obj));
    this.attr('page', 'edit');
  },
  viewObject(scope, dom, event, obj) {
    this.attr('viewId', this.attr('view.connection').id(obj));
    this.attr('page', 'details');
  },
  saveObject(scope, dom, event, obj) {
    this.attr('progress', 100);
    this.attr('page', 'loading');
    var deferred = this.attr('view.connection').save(obj);
    deferred.then(result => {
      //add a message
      PubSub.publish(ADD_MESSSAGE_TOPIC, new Message({
        message: this.attr('view.saveSuccessMessage'),
        detail: 'ID: ' + this.attr('view.connection').id(result)
      }));

      //update the view id
      this.attr('viewId', result.attr('id'));

      //set page to the details view by default
      this.attr('page', 'details');

    }).fail(e => {
      console.warn(e);
      PubSub.publish(ADD_MESSSAGE_TOPIC, new Message({
        message: this.attr('view.saveFailMessage'),
        detail: e.statusText + ' : <small>' + e.responseText + '</small>',
        level: 'danger',
        timeout: 20000
      }));
      this.attr('page', 'all');
    });
    return deferred;
  },
  setPage(page) {
    this.attr('page', page);
    this.attr('viewId', 0);
  },
  getNewObject() {
    //create a new empty object with the defaults provided
    //from the objectTemplate property which is a map
    return this.attr('view.objectTemplate')();
  },
  deleteObject(scope, dom, event, obj, skipConfirm) {
    if (obj && (skipConfirm || confirm('Are you sure you want to delete this record?'))) {
      let deferred = this.attr('view.connection').destroy(obj);
      deferred.then(result => {
        //add a message
        PubSub.publish(ADD_MESSSAGE_TOPIC, new Message({
          message: this.attr('view.deleteSuccessMessage'),
          detail: 'ID: ' + this.attr('view.connection').id(result)
        }));
      });

      deferred.fail(result => {
        //add a message
        PubSub.publish(ADD_MESSSAGE_TOPIC, new Message({
          message: this.attr('view.deleteFailMessage'),
          detail: result.statusText + ' : <small>' + result.responseText + '</small>',
          level: 'danger',
          timeout: 20000
        }));
      });
      return deferred;
    }
  },
  deleteMultiple() {
    if (confirm('Are you sure you want to delete the selected records?')) {
      this.attr('selectedObjects').forEach((obj) => {
        this.deleteObject(null, null, null, obj, true);
      });
      this.attr('selectedObjects').replace([]);
    }
  },
  setFilterParameter(filters) {
    var params = this.attr('parameters');
    //reset the page filter
    this.attr('queryPage', 0);
    if (filters && filters.length) {
      //if there are filters in the list, set the filter parameter
      params.attr('filter[objects]', JSON.stringify(filters.serialize()));
    } else {
      //remove the filter parameter
      params.removeAttr('filter[objects]');
    }
  },
  setSortParameter(sort) {
    var params = this.attr('parameters');
    if (!sort.attr('fieldName')) {
      params.removeAttr('sort');
      return sort;
    }
    this.attr('parameters.sort', sort.type === 'asc' ? sort.fieldName : '-' + sort.fieldName);
  },
  toggleFilter(val) {
    if (typeof val !== 'undefined') {
      this.attr('filterVisible', val);
    } else {
      this.attr('filterVisible', !this.attr('filterVisible'));
    }
  },
  isListTable() {
    return this.attr('view.listType') !== 'property-table';
  },
  getRelatedValue(foreignKey, focusObject) {
    return focusObject.attr(foreignKey);
  }
});

Component.extend({
  tag: 'crud-manager',
  viewModel: ViewModel,
  template: template,
  leakScope: false,
  events: {
    //bind to the change event of the entire list
    '{viewModel.queryFilters} change' (filters) {
      this.viewModel.setFilterParameter(filters);
    },
    //bind to the change event of the entire map
    '{viewModel.sort} change' (sort) {
      this.viewModel.setSortParameter(sort);
    }
  }
});
