/*jshint esnext:true */
import can from 'can/util/library';
import CanMap from 'can/map/';
import List from 'can/list/';
import route from 'can/route/';
import 'can/view/stache/';
import 'can/map/define/';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap/dist/css/bootstrap-theme.min.css!';
import 'font-awesome/css/font-awesome.min.css';
import './crud.css!';
import template from './crud.stache!';
import 'components/crud-manager/';


export let AppViewModel = can.Map.extend({
  define: {
    views: {
      Type: List
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
    this.activateViewById(route.attr('view') || this.attr('views')[0].attr('id'));
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    route(':view/:page/:objectId/');
    route.ready();
    this.attr(route.attr());

    //bind to properties that should update the route
    this.bind('objectId', this.updateRoute.bind(this, 'objectId'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
    route.bind('change', this.routeChanged.bind(this));
  },
  routeChanged: function() {
    this.attr(route.attr());
    if (this.attr('activeView.id') !== route.attr('view')) {
      this.activateViewById(route.attr('view'));
    }
  },
  toggleMenu: function(e) {
    this.attr('sidebarHidden', !this.attr('sidebarHidden'));
    return false;
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
    if (route.attr('view') !== view.attr('id')) {
      route.attr('view', view.attr('id'));
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
    this.activateViewById(route.attr('view'));
  },
  updateRoute: function(name, action, value, oldValue) {
    if (!value) {
      route.attr(name, '');
    }
    route.attr(name, value);
  },
  getViewUrl(view){
    return route.url({
      page: 'all',
      view: view.attr('id'),
      objectId: 0
    });
  }
});
