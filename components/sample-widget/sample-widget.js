

import CanMap from 'can/map/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';

export let viewModel = CanMap.extend({
  define:{

  }
});

Component.extend({
  tag: 'sample-widget',
  viewModel: viewModel,
  template: template,
  events: {
    inserted: function() {
      //
    }
  }
});
