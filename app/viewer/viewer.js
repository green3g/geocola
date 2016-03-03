/*jshint esnext:true */
import can from 'can';
//import components and css to include
import './components';
//import the app template
import template from './viewer.stache!';

import Factory from './LayerFactory';

export let AppViewModel = can.Map.extend({
  define: {
  },
  onDrag: function(){
    console.log(arguments);
  },
  startup: function(domNode) {

    this.attr('mapOptions.layers', this.getLayers(this.attr('mapOptions.layers')));
    this.attr('mapOptions.view', this.getView(this.attr('mapOptions.view')));
    //render the template with the config
    can.$(domNode).html(can.view(template, this));

    //fix an issue with map stretching when steal builds the app
    setTimeout(function() {
      var maps = can.$('ol-map');
      maps.each(function(index, node) {
        var viewModel = can.$(node).viewModel();
        viewModel.attr('mapObject').updateSize();
      });
    }, 500);

    can.viewModel(document.getElementById('main-map')).on('resize', function(event, width) {
      can.viewModel(document.getElementById('identify-popup'), 'modal', width < 500);
    });
  },
  getLayers: function(layerConf){
    var layers = [];
    layerConf.reverse().forEach(function(l){
      layers.push(Factory.getLayer(l));
    });
    return new ol.Collection(layers);
  },
  getView: function(viewConf){
    viewConf.projection = ol.proj.get(viewConf.projection);
    return new ol.View(viewConf);
  }
});
