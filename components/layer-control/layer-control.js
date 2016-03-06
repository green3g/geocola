/* jshint esnext: true */
import can from 'can';
import template from './layercontrol.stache!';
import './layercontrol.css!';

const controlTemplates = {
  'default': '<layer-control-default {layer}="." />',
  'Group': '<layer-control-group {layer}="." />',
  'TileWMS': '<layer-control-tilewms {layer}="." />'
};

/**
 * @module layer-control
 * @parent components
 * @body
## Description

A layer controller to handle layer visibility and perform additional layer functions.

## Usage

```html
<layer-control map-node="#map" />
```

 */
export const ViewModel = can.Map.extend({
  define: {
    /**
     * [layers description]
     * @property {Object}
     */
    layers: {
      Value: can.List
    },
    /**
     * [mapNode description]
     * @property {Object}
     */
    mapNode: {
      type: 'string'
    }
  },
  /**
   * @prototype
   */
  /**
   * Initializes the layer control once the map is ready
   * @signature
   * @param  {[type]} mapViewModel [description]
   * @return {[type]}              [description]
   */
  initControl: function(mapViewModel) {
    var self = this;
    mapViewModel.ready().then(function(map) {
      self.addLayers(map.getLayers());
    });
  },
  /**
   * Calls `addLayer` for each layer currently in the collection and binds to the add/remove events of the collection
   * @param  {[type]} collection [description]
   * @return {[type]}            [description]
   */
  addLayers: function(collection) {
    var self = this;
    collection.forEach(function(layer, index) {
      self.addLayer(layer, 0);
    });

    //bind listeners for collection changes
    collection.on('add', function(event) {
      //find the index of the added layer
      collection.forEach(function(layer, index) {
        if (event.element === layer) {
          //we're creating a reversed array from that of the ol.collection
          var newIndex = collection.getLength() - index - 1;
          self.addLayer(event.element, newIndex);
        }
      });
    });

    collection.on('remove', function(event) {
      self.removeLayerById(event.element.get('id'));
    });
  },
  /**
   * Adds a layer to the view models collection
   * @param  {[type]} layer [description]
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  addLayer: function(layer, index) {
    var filteredLayers = this.attr('layers').filter(function(l) {
        return l.attr('id') === layer.get('id');
      });
    if (filteredLayers.length === 0) {
      this.attr('layers').splice(index, 0, {
        exclude: layer.get('excludeControl'),
        title: layer.get('title') || 'Layer',
        visible: layer.getVisible(),
        layer: layer,
        template: this.getLayerTemplate(layer)
      });
    }
  },
  /**
   * Removes a layer
   * @param  {String} id The unique layer id
   * @return {Boolean} The result of the remove, true if successful, false if
   * the layer was not found
   */
  removeLayerById: function(id) {
    var self = this;
    this.attr('layers').each(function(layer, index) {
      if (layer.attr('layer').get('id') === id) {
        self.attr('layers').splice(index, 1);
        return false;
      }
    });
    return true;
  },
  /**
   * Returns a template renderer for the layer
   * @param  {[type]} layer [description]
   * @return {[type]}       [description]
   */
  getLayerTemplate: function(layer) {
    var template;
    //handle layers without sources
    if (!layer.getSource) {
      for (template in controlTemplates) {
        if (controlTemplates.hasOwnProperty(template) &&
          ol.layer[template] &&
          layer instanceof ol.layer[template]) {
          return can.stache(controlTemplates[template]);
        }
      }
      return can.stache(controlTemplates['default']);
    }
    //handle layer sources for more specific
    //layer types
    var layerSource = layer.getSource();
    for (template in controlTemplates) {
      if (controlTemplates.hasOwnProperty(template) &&
        ol.source[template] &&
        layerSource instanceof ol.source[template]) {
        return can.stache(controlTemplates[template]);
      }
    }
    return can.stache(controlTemplates['default']);
  }
});

export default can.Component.extend({
  tag: 'layer-control',
  viewModel: ViewModel,
  template: template,
  events: {
    inserted: function() {
      var node = can.$(this.viewModel.attr('mapNode'));
      if (node.length) {
        this.viewModel.initControl(node.viewModel());
      }
    }
  }
});
