/*jshint esnext:true */
import template from './crud.stache!';
import can from 'can';
import 'bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css!';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import './crud.css!';
import 'components/crud-manager/';
import 'components/tab-container/';


export let AppViewModel = can.Map.extend({
  define: {
    views: {
      Type: can.List
    },
    parameters: {
      Value: can.Map
    },
    page: {
      type: 'string',
      value: 'all'
    },
    objectId: {
      type: 'number',
      value: 0
    },
    activeView: {
      value: null
    },
    sidebarHidden: {
      type: 'boolean',
      value: false
    }
  },
  startup: function(domNode) {
    this.initRoute();
    this.activateViewById(can.route.attr('view') || this.attr('views')[0].attr('id'));
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    can.route(':view/:page/:objectId/');
    can.route.ready();
    this.attr(can.route.attr());

    //bind to properties that should update the route
    this.bind('objectId', this.updateRoute.bind(this, 'objectId'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
    can.route.bind('change', this.routeChanged.bind(this));
  },
  routeChanged: function() {
    this.attr(can.route.attr());
    if (this.attr('activeView.id') !== can.route.attr('view')) {
      this.activateViewById(can.route.attr('view'));
    }
  },
  toggleMenu: function(e) {
    this.attr('sidebarHidden', !this.attr('sidebarHidden'))
  },
  activateViewById: function(name) {
    var self = this;
    this.attr('views').forEach(function(view) {
      if (view.attr('id') === name) {
        self.activateView(view);
      }
    });
  },
  activateView: function(view) {
    this.attr('activeView', view);
    if (can.route.attr('view') !== view.attr('id')) {
      can.route.attr('view', view.attr('id'));
    }
  },
  navigateToView: function(view) {
    this.attr({
      page: 'all',
      objectId: 0
    });
    this.attr('parameters', {});
    this.activateView(view);
    return false;
  },
  routeChange: function() {
    this.activateViewById(can.route.attr('view'));
  },
  updateRoute: function(name, action, value, oldValue) {
    if (!value) {
      can.route.attr(name, '');
    }
    can.route.attr(name, value);
  },
  getRelatedFilter: function(view, id) {
    return [{
      name: view.attr('foreignKey'),
      op: '==',
      val: id
    }];
  },
  getRelatedConnection: function(view, id) {
    var connection = view.attr('view.connection');
    var idField = view.attr('foreignKey');
    connection.attr('map').defaults[idField] = id;
    return connection;
  }
});
