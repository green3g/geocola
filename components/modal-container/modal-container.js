/* jshint esnext:true */

import widgetModel from 'components/widget-model';
import can from 'can';
import template from './template.stache!';

export let ViewModel = widgetModel.extend({
  define: {
    title: {
      type: 'string',
      value: 'Dialog'
    },
    visible: {
      type: 'boolean',
      value: true
    }
  },
  show: function(){
    can.$('#modal-' + this.attr('instanceId')).modal('show');
    this.dispatch('show');
  },
  hide: function(){
    can.$('#modal-' + this.attr('instanceId')).modal('hide');
    this.dispatch('hide');
  }
});

export let ModalContainer = can.Component.extend({
  tag: 'modal-container',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function(){
      if(this.viewModel.attr('visible')){
        this.viewModel.show();
      }
    }
  }
});
