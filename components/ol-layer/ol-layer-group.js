/* jshint esnext: true */
import can from 'can';
import 'can/construct/super/';
import {olLayer, ViewModel} from './ol-layer';

export const GroupViewModel = ViewModel.extend({
  define: can.extend(ViewModel.prototype.define, {
    type: {
      value: 'Group',
      type: 'string'
    },
    radioGroup: {
      type: 'boolean',
      value: false
    }
  }),
  getLayer: function(){
    if(!this.attr('layerObject')){
      this.attr('layerObject', ViewModel.prototype.getLayer.call(this));
    }
    return this.attr('layerObject');
  },
  getLayerOptions: function() {
    return can.extend(ViewModel.prototype.getLayerOptions.call(this), {
      radioGroup: this.attr('radioGroup')
    });
  },
  addLayer: function(layer){
    this.attr('layerObject').getLayers().insertAt(0, layer);
  }
});

export default olLayer.extend({
  tag: 'ol-layer-group',
  viewModel: GroupViewModel
});
