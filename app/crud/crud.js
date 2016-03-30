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
    console.log(this.attr('parameters'))
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
    can.route.bind('change', this.routeChanged.bind(this));
  },
  routeChanged: function() {
    this.attr(can.route.attr());
    if (this.attr('activeModel.id') !== can.route.attr('model')) {
      this.activateModelById(can.route.attr('model'));
    }
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
    if (can.route.attr('model') !== model.attr('id')) {
      can.route.attr('model', model.attr('id'));
    }
  },
  navigateToModel: function(model) {
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
  },
  getRelatedFilter: function(model, id) {
    return [{
      name: model.attr('foreignKey'),
      op: '==',
      val: id
    }];
  },
  getRelatedConnection: function(model, id) {
    console.log(model, id);
    var connection = model.attr('connection');
    var idField = model.attr('foreignKey');
    connection.attr('map').defaults[idField] = id;
    return connection;
  }
});
