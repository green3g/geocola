/* jshint esnext: true */

import Map from 'can/map/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';

export let viewModel = Map.extend({
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
