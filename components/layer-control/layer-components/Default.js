
import can from 'can';
import DefaultTemplate from './Default.stache!';

var DefaultViewModel = can.Map.extend({
  init: function() {
    var layer = this.attr('layer.layer');
    this.attr('visible', layer.getVisible());
    layer.on('change:visible', this.updateVisible.bind(this));
  },
  toggleVisible: function(e) {
    this.attr('layer.layer').setVisible(!this.attr('visible'));
  },
  updateVisible: function(e){
    this.attr('visible', e.target.getVisible());
  }
});

can.Component.extend({
  tag: 'layer-control-default',
  viewModel: DefaultViewModel,
  template: DefaultTemplate
});

export default DefaultViewModel;
