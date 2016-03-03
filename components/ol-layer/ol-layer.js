/* jshint esnext: true */
import Component from 'can/component/component';
import widgetModel from 'components/widget-model';

export const ViewModel = widgetModel.extend({
  define: {
    title: {
      type: 'string',
      value: null
    },
    visible: {
      type: 'boolean',
      value: true
    },
    type: {
      // ol.layer[{string}]
      value: 'Tile',
      type: 'string'
    },
    excludeIdentify: {
      type: 'boolean',
      value: false
    },
    excludeLegend: {
      type: 'boolean',
      value: false
    },
    excludeControl: {
      type: 'boolean',
      value: false
    }

  },
  getLayerOptions: function() {
    return {
      visible: this.attr('visible'),
      title: this.attr('title'),
      id: this.attr('instanceId'),
      excludeIdentify: this.attr('excludeIdentify'),
      excludeLegend: this.attr('excludeLegend'),
      excludeControl: this.attr('excludeControl')
    };
  },
  getLayer: function() {
    return new ol.layer[this.attr('type')](this.getLayerOptions());
  },
  addLayerToObject: function(parent) {
    parent.addLayer(this.getLayer());
  }
});

export const olLayer = Component.extend({
  tag: 'ol-layer',
  viewModel: ViewModel,
  events: {
    inserted: function() {
      var parent = this.element.parent().viewModel();
      this.viewModel.addLayerToObject(parent);
    }
  }
});
