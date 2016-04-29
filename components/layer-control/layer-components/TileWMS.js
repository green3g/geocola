
import can from 'can';
import baseViewModel from './Default';
import template from './TileWMS.stache!';

var ViewModel = baseViewModel.extend({
  define: {
    collapsed: {
      type: 'boolean',
      value: true
    },
    defaultSublayerVisible: {
      type: 'boolean',
      value: true
    },
    legendUrl: {
      get: function() {
        var separator;
        if (this.attr(''))
          return;
      }
    }
  },
  init: function() {
    baseViewModel.prototype.init.apply(this, arguments);
    var source = this.attr('layer.layer').getSource();
    var params = source.getParams();
    var sublayers = (params.LAYERS || params.layers).split(',');
    var sublayerObjects = [];
    var defaultVisible = this.attr('defaultSublayerVisible');
    sublayers.forEach(function(sublayer) {
      sublayerObjects.push({
        title: sublayer, //TODO: make configureable title options
        id: sublayer,
        visible: defaultVisible,
        collapsed: true,
        baseUrl: source.getUrls()[0],
        toggleCollapsed: function(sublayer) {
          sublayer.attr('collapsed', !sublayer.attr('collapsed'));
        },
        getLegendGraphicURL: function() {
          var separator;
          if (this.baseUrl.indexOf('?') > -1) {
            separator = '';
          } else {
            separator = '?';
          }
          return [
            this.baseUrl,
            separator,
            'REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=40&LAYER=',
            this.id
          ].join('');
        }
      });
    });
    this.attr('sublayers', sublayerObjects);
    this.updateSublayerVisibility();
  },
  toggleCollapsed: function() {
    this.attr('collapsed', !this.attr('collapsed'));
  },
  setSublayerVisibility: function(sublayer) {
    var visible = sublayer.attr('visible');
    sublayer.attr('visible', !visible);
    this.updateSublayerVisibility();
  },
  updateSublayerVisibility: function() {
    var source = this.attr('layer.layer').getSource();
    var newLayersParam = this.attr('sublayers').filter(function(s) {
      return s.visible;
    }).map(function(s) {
      return s.id;
    }).join(',');
    source.updateParams({
      LAYERS: newLayersParam
    });
  }
});

can.Component.extend({
  tag: 'layer-control-tilewms',
  viewModel: ViewModel,
  template: template
});
