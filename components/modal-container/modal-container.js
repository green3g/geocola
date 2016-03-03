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
  },
  hide: function(){
    can.$('#modal-' + this.attr('instanceId')).modal('hide');
  }
});

export let ModalContainer = can.Component.extend({
  tag: 'modal-container',
  template: template,
  viewModel: ViewModel
});
