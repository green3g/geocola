/* jshint esnext: true */
import ol from 'openlayers';
import {
  olLayer,
  ViewModel
} from './ol-layer';
import can from 'can';

export default olLayer.extend({
tag: 'ol-layer-custom',
viewModel: ViewModel.extend({
    //include props from parent class
    //https://github.com/canjs/canjs/issues/1322
    define: can.extend(ViewModel.prototype.define, {
      type: {
        type: 'string',
        value: 'Tile'
      },
      layerOptions: {
        type: '*',
        value: {}
      }
    }),
    getLayerOptions: function() {
      return can.extend(ViewModel.prototype.getLayerOptions.call(this),
        this.attr('layerOptions'))
    });
}
})
});
