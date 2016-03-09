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
    id: {
      type: 'number',
      value: null
    },
    activeModel: {
      value: null
    },
    sidebarHidden: {
      type: 'boolean',
      value: false
    }
  },
  activate: function(model) {
    this.attr('activeModel', model);
  },
  startup: function(domNode) {
    this.initRoute();
    this.activateDefaultModel();
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    can.route(':modelName/:page/:id/');
    can.route.ready();
    this.attr(can.route.attr());

    //when these properties change, update the route and vice versa
    can.route.bind('change', this.routeChange.bind(this));
    this.bind('id', this.updateRoute.bind(this, 'id'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
    this.bind('parameters', this.updateRoute.bind(this, 'parameters'));
  },
  toggleMenu: function(e) {
    this.attr('sidebarHidden', !this.attr('sidebarHidden'))
  },
  activateDefaultModel: function() {
    if (this.attr('modelName')) {
      var self = this;
      this.attr('models').forEach(function(model) {
        if (model.id === this.attr('modelName')) {
          self.activate(model);
        }
      })
    } else {
      this.activate(this.attr('models')[0]);
    }
  },
  routeChange: function() {
    this.attr(can.route.attr());
  },
  updateRoute: function(name, action, value, oldValue) {
    console.log(name, value);
    if (!value) {
      can.route.attr(name, '');
    }
    can.route.attr(name, value);
    console.log(can.route.attr())
  }
});
