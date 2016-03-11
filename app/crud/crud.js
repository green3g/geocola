/*jshint esnext:true */
import template from './crud.stache!';
import can from 'can';
import 'bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css!';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import './crud.css!'
import 'components/crud-manager/';
import 'components/tab-container/';


export let AppViewModel = can.Map.extend({
  define: {
    models: {
      Type: can.List
    },
    parameters: {
      Type: can.Map,
      Value: can.Map
    },
    page: {
      type: 'string',
      value: 'all'
    },
    viewId: {
      type: 'number',
      value: 0
    },
    activeModel: {
      value: null
    },
    sidebarHidden: {
      type: 'boolean',
      value: false
    }
  },
  startup: function(domNode) {
    this.initRoute();
    this.activateModelById(can.route.attr('model') || this.attr('models')[0].attr('id'));
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    can.route(':model/:page/:viewId/');
    can.route.ready();
    this.attr(can.route.attr());

    //bind to properties that should update the route
    this.bind('viewId', this.updateRoute.bind(this, 'viewId'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
  },
  toggleMenu: function(e) {
    this.attr('sidebarHidden', !this.attr('sidebarHidden'))
  },
  activateModelById: function(name) {
    var self = this;
    this.attr('models').forEach(function(model) {
      if (model.attr('id') === name) {
        self.activateModel(model);
      }
    });
  },
  activateModel: function(model) {
    this.attr('activeModel', model);
    can.route.attr('model', model.attr('id'));
  },
  navigateToModel: function(model){
    this.attr({
      page: 'all',
      viewId: 0
    });
    this.attr('parameters', {});
    this.activateModel(model);
    return false;
  },
  routeChange: function() {
    this.activateModelById(can.route.attr('model'));
  },
  updateRoute: function(name, action, value, oldValue) {
    if (!value) {
      can.route.attr(name, '');
    }
    can.route.attr(name, value);
  }
});
