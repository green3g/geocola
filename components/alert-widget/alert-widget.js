import CanMap from 'can/map/';
import 'can/map/define/';
import List from 'can/list/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';

export const ViewModel = CanMap.extend({
  define:{
    messages: {
      Value: List
    }
  },
  addMessage(message){
    this.attr('messages').push(message);
  },
  removeMessage: function(message) {
    var index = this.attr('messages').indexOf(message);
    this.attr('messages').splice(index, 1);
  }
});

Component.extend({
  tag: 'alert-widget',
  viewModel: ViewModel,
  template: template
});
