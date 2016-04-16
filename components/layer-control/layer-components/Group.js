
import can from 'can';

import { ViewModel as baseViewModel } from '../layer-control';

import template from './Group.stache!';

var ViewModel = baseViewModel.extend({
  define:  {
    /**
     * [layers description]
     * @property {Object}
     */
    layers: {
      Value: can.List
    },
    visible: {
      type: 'boolean'
    },
    collapsed: {
      type: 'boolean',
      value: true
    },
    radioGroup: {
      type: 'boolean',
      value: false
    },
    radioVisible: {
      type: 'string',
      value: null
    }
  },
  init: function() {
    baseViewModel.prototype.init.apply(this, arguments);
    this.attr('visible', this.attr('layer.layer').getVisible());
    var layer = this.attr('layer.layer');
    this.addLayers(layer.getLayers());

    if (layer.get('radioGroup')) {
      this.attr('radioGroup', true);
    }
  },
  toggleVisible: function(e) {
    this.attr('layer.layer').setVisible(!this.attr('visible'));
    this.attr('visible', !this.attr('visible'));
  },
  toggleCollapsed: function(e) {
    this.attr('collapsed', !this.attr('collapsed'));
  },
  setRadioVisible: function(selectedLayer) {
    this.attr('radioVisible', selectedLayer);
    this.attr('layers').forEach(function(layer) {
      var visible = selectedLayer.attr('layer').get('id') === layer.attr('layer').get('id');
      layer.attr('layer').setVisible(visible);
      layer.attr('visible', visible);
    });
  }
});

can.Component.extend({
  tag: 'layer-control-group',
  viewModel: ViewModel,
  template: template
});
