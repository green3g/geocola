import template from './crud.stache!';
import can from 'can';
import 'bootstrap';
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
      get: function(){
        return this.attr('connections').length > 1;
      }
    }
  },
  startup: function(domNode) {
    can.$(domNode).html(can.view(template, this));
  }
});
