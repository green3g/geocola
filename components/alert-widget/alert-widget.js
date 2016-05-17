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
  removeMessage: function(e) {
    var index = this.attr('messages').indexOf(e);
    this.attr('messages').splice(index, 1);
  }
});

Component.extend({
  tag: 'alert-widget',
  viewModel: ViewModel,
  template: template
});
