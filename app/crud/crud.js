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
    }
  },
  startup: function(domNode) {
    this.initRoute();
    can.$(domNode).html(can.view(template, this));
  },
  initRoute: function() {
    can.route(':page/:id/');
    can.route.ready();
    this.attr(can.route.attr());

    //when these properties change, update the route and vice versa
    can.route.bind('change', this.routeChange.bind(this));
    this.bind('id', this.updateRoute.bind(this, 'id'));
    this.bind('page', this.updateRoute.bind(this, 'page'));
    this.bind('parameters', this.updateRoute.bind(this, 'parameters'));
  },
  routeChange: function() {
    this.attr(can.route.attr());
  },
  updateRoute: function(name, action, value, oldValue) {
    console.log(name, value);
    if(!value){
      can.route.attr(name, '');
    }
    can.route.attr(name, value);
    console.log(can.route.attr())
  }
});
