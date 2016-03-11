/*jshint esnext:true */
import template from './crud.stache!';
import can from 'can';
import 'bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css!';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import 'components/crud-manager/';
import 'components/tab-container/';


export let AppViewModel = can.Map.extend({
  define: {
    connections: {
      Type: can.List
    },
    parameters: {
      Type: can.Map
    },
    tabbed: {
      get: function() {
        return this.attr('connections').length > 1;
      }
    },
    page: {
      type: 'string',
      value: 'all'
    },
    id: {
      type: 'number',
      value: null
    }
  },
  startup: function(domNode) {
    this.initRoute();
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    can.route(':page/:id');
    can.route.ready();
    can.route.bind('change', this.routeChange.bind(this));
    this.attr(can.route.attr());
    this.bind('id', this.updateRoute.bind(this, 'id'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
  },
  routeChange: function() {
    this.attr(can.route.attr());
  },
  updateRoute: function(name, action, value, oldValue) {
    if (!value) {
      value = null;
    }
    var props = ['id', 'page'];
    if (props.indexOf(name) !== -1) {
      can.route.attr(name, value);
    }
  }
});
