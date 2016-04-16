

import ol from 'openlayers';
import can from 'can';

var layerClass = {
  TileWMS: 'Tile',
  Group: 'Group',
  OSM: 'Tile',
  ImageWMS: 'Image'
};

var currentId = 0;
var getNextId = function() {
  return currentId++;
};

export default {
  getLayer: function(options) {
    //if user provides the actual layer, skip the layer factory
    if (options instanceof ol.layer.Base) {
      return options;
    }
    //get the layer class name
    //different from our short name
    //For example, layer type TileWMS and ImageWMS both use type 'Tile'
    var type = layerClass[options.type];

    //the user custom constructor options
    var userOptions = options.attr('options') ? options.attr('options').attr() : {};

    //the required parameters for the layer
    var requiredOptions = this[options.type](options);

    //make sure the layer has a unique id
    if (!userOptions.id) {
      userOptions.id = 'layer-' + getNextId();
    }

    //mixin all of our configuration options for the constructor
    return new ol.layer[type](can.extend(userOptions, requiredOptions));
  },
  ImageWMS: function(options) {
    return {
      source: new ol.source.ImageWMS(options.sourceOptions.attr())
    };
  },
  TileWMS: function(options) {
    return {
      source: new ol.source.TileWMS(options.sourceOptions.attr())
    };
  },
  Group: function(options) {
    return {
      layers: new ol.Collection(options.options.layers.reverse().map(this.getLayer.bind(this)))
    };
  },
  OSM: function(options) {
    var sourceOptions = options.attr('sourceOptions') ? options.attr('sourceOptions').attr() : {};
    return {
      source: new ol.source.OSM(sourceOptions)
    };
  }
};
