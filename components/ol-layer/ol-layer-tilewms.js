/* jshint esnext: true */
import ol from 'openlayers';
import {olLayer, ViewModel} from './ol-layer';
import can from 'can';

export default olLayer.extend({
  tag: 'ol-layer-tilewms',
  viewModel: ViewModel.extend({
  //include props from parent class
  //https://github.com/canjs/canjs/issues/1322
    define: can.extend(ViewModel.prototype.define, {
      url: {
        type: 'string'
      },
      layers: {
        type: 'string'
      },
      type: {
        type: 'string',
        value: 'Tile'
      },
      tiled: {
        type: 'boolean',
        value: true
      },
      format: {
        type: 'string',
        value: 'image/png'
      }
    }),
    getLayerOptions: function() {
      return can.extend(ViewModel.prototype.getLayerOptions.call(this), {
        source: new ol.source.TileWMS({
          url: this.attr('url'),
          params: {
            'SRS': 'EPSG:3857',
            'LAYERS': this.attr('layers'),
            'tiled': this.attr('tiled'),
            'FORMAT': this.attr('format')
          }
        })
      });
    }
  })
});
