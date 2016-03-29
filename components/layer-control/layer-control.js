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
 * @parent Home.components
 * @group layer-control.types Types
 * @group layer-control.props Properties
 * @body

## Description

A layer controller to handle layer visibility and perform additional layer functions.

## Usage

```html
<layer-control map-node="#map" />
```

<img src="../cola/guides/images/layer-control.png" />

 */

/**
 * @typedef {controlLayerObject} layer-control.types.controlLayerObject controlLayerObject
 * @description Custom objects for rendering layer controls
 * @parent layer-control.types
 * @option {Boolean} exclude Whether or not to exclude from the layer control
 * @option {String} title The layer title
 * @option {Boolean} visible The layers visibility
 * @option {ol.Layer} layer The openlayers layer
 * @option {can.stache} template The template to render the layer with. This is an object provided by can.stache a stache template imported by StealJS.
 */



export const ViewModel = can.Map.extend({
  define: {
    /**
     * An internal list of layers used by the template
     * @property {Array<controlLayerObject>} layer-control.props.layers
     * @parent layer-control.props
     */
    layers: {
      Value: can.List
    },
    /**
     * The dom node selector referencing an ol-map component
     * @property {String}
     * @parent layer-control.props
     */
    mapNode: {
      type: 'string'
    },
    /**
     * The openlayers map
     * @property {ol.Map} layer-control.props.map
     * @parent layer-control.props
     */
    map: {
      type: '*',
      value: null
    }
  },
  /**
   * @prototype
   */
  init: function() {
    if (this.attr('map')) {
      this.initControl(this.attr('map'));
    }
  },
  /**
   * Initializes the layer control once the map is ready
   * @param  {ol.Map} map The openlayers map object
   */
  initControl: function(map) {
    this.addLayers(map.getLayers());
  },
  /**
   * Calls `addLayer` for each layer currently in the collection and binds to the add/remove events of the collection
   * @param  {ol.Collection} collection The collection of layers
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
   * @param  {ol.Layer} layer The layer to add
   * @param  {Number} index The layer's position in the collection
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
   * @param  {ol.Layer} layer The layer to find the template renderer for
   * @return {can.stache}       The stache renderer
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
        var self = this;
        node.viewModel().ready().then(function(map) {
          self.viewModel.initControl(map);
        });
      }
    }
  }
});
