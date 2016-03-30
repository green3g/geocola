/*jshint esnext: true */
import can from 'can';
import ol from 'openlayers';
import featureTemplate from './featureTemplate.stache!';
import template from './template.stache!';
import './styles.css!';

import 'components/property-table/';

/**
 * @module identify-widget
 * @parent Home.components
 * @group identify-widget.props Properties
 * @group identify-widget.types Types
 * @body

 ## Description
 A configureable feature identify tool for wms layers using wms `GetFeatureInfo` protocol. The wms server must be capable of privoviding json results
 - Queries wms layers and displays the results when map is clicked
 - Works inside an ol-popup componenet by centering the popup on a feature geometry when a feature is selected
 - Support for customizing each field and the entire feature's properties is baked in

 ## Usage
 This component may be placed inside an `ol-popup` component, but it doesn't have to be.
 ```html
 <ol-popup>
   <identify-widget {layer-properties}="propsObj" />
 </ol-popup>
 ```
 */

/**
 * @typedef {layerPropertiesObject} identify-widget.types.layerPropertiesObject layerPropertiesObject
 * An object consisting of a key mapped to the layer name as returned by the server with its value consisting of properties defining the layer display.
 * @parent identify-widget.types
 * @option {String} alias The label to display for the layer The default is the layer name as provided by the server
 * @option {String | can.view.renderer} template The template to render for this layer's popup. This can be a template imported via `import templateName from './templatePath.stache!';` (recommended) or a string template. The default is `components/identify-widget/featureTemplate.stache`
 * @option {property-table.types.tablePropertiesObject} properties An object consisting of tableFieldProperties.
 */

export const ViewModel = can.Map.extend({
  define: {
    /**
     * The selector for the `ol-map` map node.
     * @parent identify-widget.props
     * @signature `{String}` `map-node="#map"`
     * @property {String} identify-widget.props.mapNode
     */
    mapNode: {
      type: 'string'
    },
    /**
     * The selector for the `ol-popup` dom node. If this widget is placed inside an ol-popup, it this property must be provided so the identify widget can correctly center the popup on the feature.
     * @parent identify-widget.props
     * @signature `{String}` `popup-node="#identify-popup"`
     */
    popupNode: {
      type: 'string'
    },
    /**
     * The max number of features to return for each layer. The default is 10.
     * @parent identify-widget.props
     * @signature `{Number}` `max-feature-count="10"`
     * @property {Number} identify-widget.props.maxFeatureCount
     */
    maxFeatureCount: {
      type: 'number',
      value: 10
    },
    /**
     * Buffer distance in pixels around the map click. The default is 10.
     * @parent identify-widget.props
     * @signature `{Number}` `feature-buffer="10"`
     * @property {Number} identify-widget.props.featureBuffer
     */
    featureBuffer: {
      type: 'number',
      value: 10
    },
    /**
     * Layer configuration properties
     * @parent identify-widget.props
     * @property {layerPropertiesObject} identify-widget.props.layerProperties
     */
    layerProperties: {
      Value: can.Map
    },
    /**
     * The map click key to assign to this widget. When the map is clicked, and this key is the set as the current map click, it will trigger an identify.
     * @parent identify-widget.props
     * @property {Object} identify-widget.props.mapClickKey
     */
    mapClickKey: {
      type: 'string',
      value: 'identify'
    },
    /**
     * The list of features that have been identified
     * @parent identify-widget.props
     * @property {Array<ol.Feature>} identify-widget.props._features
     */
    _features: {
      Value: can.List
    },
    /**
     * Whether or not all identifies have completed. This is used internally by the template.
     * @parent identify-widget.props
     * @property {can.Deferred} identify-widget.props._loading
     */
    _loading: {
      value: function() {
        var d = can.Deferred();
        d.resolve();
        return d;
      }
    },
    /**
     * A list of pending identify deferreds
     * @parent identify-widget.props
     * @property {Array<can.Deferred>} identify-widget.props._deferreds
     */
    _deferreds: {
      Value: can.List,
    },
    /**
     * The currently selected feature index
     * @parent identify-widget.props
     * @property {Number}
     */
    _activeFeatureIndex: {
      value: 0,
      type: 'number'
    },
    /**
     * If the feature list has one or more features after the selected feature, this will be true. This is used by the template to enable/disable the forward and back buttons.
     * @parent identify-widget.props
     * @property {Boolean} identify-widget.props._hasNextFeature
     */
    _hasNextFeature: {
      get: function() {
        return this.attr('_activeFeatureIndex') < this.attr('_features').length - 1;

      }
    },
    /**
     * If the feature list has one or more features before the selected feature, this will be true. This is used by the template to enable/disable the forward and back buttons.
     * @parent identify-widget.props
     * @property {Boolean} identify-widget.props._hasPreviousFeature
     */
    _hasPreviousFeature: {
      get: function() {
        return this.attr('_activeFeatureIndex') > 0;
      }
    },
    /**
     * A virtual property that returns an object consisting of the formatted fields, values, and layer properties.
     * @parent identify-widget.props
     * @property {can.Map} identify-widget.props._activeFeature
     */
    _activeFeature: {
      get: function() {
        //if no _features, return null
        if (!this.attr('_features').length) {
          //update Map layer
          this.updateSelectedFeature(null);
          return null;
        }

        //get this active feature by array index
        var feature = this.attr('_features')[this.attr('_activeFeatureIndex')];

        //update Map layer
        this.updateSelectedFeature(feature);

        //get the layer key name. Layer id is returned from wms by LayerName.fetureID
        var layer = feature.getId().split('.');
        var index = layer[1];
        layer = layer[0];

        //get the configured layer properties object key this.layerProperties.layerName
        var layerProperties = ['layerProperties', layer].join('.');
        var template, fieldProperties, prop;
        var title;

        //if its provided parse the alias and formatters
        if (this.attr(layerProperties)) {

          //set the layer alias
          title = this.attr([layerProperties, 'alias'].join('.'));

          //set the correct template for this feature this.layerproperties.layername.template
          template = this.attr([layerProperties, 'template'].join('.'));
        }

        //show popup if used
        if (this.attr('popupModel')) {
          //there seems to be a bug when loading geojson features
          var extent = feature
            .getGeometry()
            .getExtent();
          this.attr('popupModel').centerPopup(ol.extent.getCenter(extent));
        }

        return {
          //raw ol.feature
          feature: feature,
          //feature property values
          properties: feature.getProperties(),
          //get the field properties like alias and formatters this.layerproperties.layername.properties
          fieldProperties: this.attr([layerProperties, 'fieldProperties'].join('.')) || {},
          //feature template
          featureTemplate: template || featureTemplate,
          //the default template in case the other template wants to use it
          defaultTemplate: featureTemplate,
          layer: layer,
          title: title || layer,
          index: index
        };
      }
    },
  },
  /**
   * @prototype
   */
  /**
   * Initializes this widget by finding the map and popup if provided and setting up the map click handler
   * @signature
   * @param  {Object} models A object consisting of the map and popup viewModels
   */
  initWidget: function(models) {
    this.attr('mapModel', models.map);
    this.attr('popupModel', models.popup);
    if (!this.attr('popupModel') && this.attr('mapModel')) {
      this.attr('mapModel').addClickHandler(this.attr('mapClickKey'), this.identify.bind(this));
    }

    if (this.attr('popupModel')) {
      this.attr('popupModel').on('show', this.identify.bind(this));
      this.attr('popupModel').on('hide', this.clearFeatures.bind(this));
    }
  },
  /**
   * Queries the available map wms layers and updates the loading status
   * @signature
   * @param  {ol.events.Event} event The click event dispatched by the map
   * @param  {Array<Number>} coordinate Optional coordinate array to identify at
   * @return {Promise} A promise that is resolved when all of the identifies have finished loading
   */
  identify: function(event, coordinate) {
    if (!coordinate) {
      coordinate = event;
    }
    this.clearFeatures();
    var self = this;
    this.attr('hasError', null);
    var layers = this.attr('mapModel').getMap().getLayers();
    var urls = this.getQueryURLsRecursive(layers, coordinate);
    var deferreds = [];
    this.attr('_loading', can.Deferred());
    urls.forEach(function(url) {
      var def = self.getFeatureInfo(url);
      deferreds.push(def);
    });
    if (!deferreds.length) {
      this.attr('_loading').resolve([]);
    }
    var resolved = 0;
    deferreds.forEach(function(d) {
      d.then(function(json) {
        self.addFeatures(json, coordinate);
        resolved++;
        self.updateLoading(resolved, deferreds.length);
      }).fail(function(e) {
        self.error(e);
        resolved++;
        self.updateLoading(resolved, deferreds.length);
      });
    });
    this.attr('_deferreds', deferreds);
    return this.attr('_loading').promise();
  },
  /**
   * Updates the loading status after each identify promise is resolved
   * @signature
   * @param  {Number} resolved The current number of resolved promises
   * @param  {Number} total  The total number of promises
   */
  updateLoading: function(resolved, total) {
    if (resolved === total) {
      this.attr('_loading').resolve(this.attr('_features'));
    }
  },
  /**
   * Recursively queries wms layers for identify results. Recursion is used to drill into group layers
   * @signature
   * @param  {ol.Collection<ol.Layer>} layers     A collection (array) of layers
   * @param  {Array<Number>} coordinate The current identify coordinate
   * @return {Array<String>}            Array of GetFeatureInfo urls
   */
  getQueryURLsRecursive: function(layers, coordinate) {
    var self = this;
    var urls = [];
    layers.forEach(function(layer) {
      if (layer.getVisible() && !layer.get('excludeIdentify')) {
        if (layer instanceof ol.layer.Group) {
          urls = urls.concat(self.getQueryURLsRecursive(layer.getLayers(), coordinate));
        } else {
          var url = self.getQueryURL(layer, coordinate);
          if (url) {
            urls.push(url);
          }
        }
      }
    });
    return urls;
  },
  /**
   * Creates a wms getGetFeatureInfo url
   * @signature
   * @param  {ol.layer} layer      The wms layer
   * @param  {Array<Number>} coordinate The coordinate pair to identify at
   * @return {String}            The url to query for identify results
   */
  getQueryURL: function(layer, coordinate) {
    if (layer.getSource && layer.getVisible()) {
      var source = layer.getSource();
      if (source && typeof source.getGetFeatureInfoUrl !== 'undefined') {
        var map = this.attr('mapModel').getMap();
        var view = map.getView();
        return source.getGetFeatureInfoUrl(
          coordinate,
          view.getResolution(),
          view.getProjection(), {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': this.attr('maxFeatureCount'),
            'BUFFER': this.attr('featureBuffer')
              //'QUERY_LAYERS': 'only_query_these_layers'
          });
      }
    }
  },
  /**
   * Queries the wms endpoint for identify results
   * @signature
   * @param  {String} url The url to query
   * @return {Deferred}     The deferred that is resolved to the raw wms feature data
   */
  getFeatureInfo: function(url) {
    return can.ajax({
      url: url,
      dataType: 'json',
      method: 'GET'
    });
  },
  /**
   * Adds features to this widgets collection after a layer has been identified
   * @signature
   * @param  {Object} collection A GeoJSON feature collection
   * @param  {Array<Number>} coordinate The coordinate pair where the mouse click occurred
   */
  addFeatures: function(collection, coordinate) {
    if (collection.features.length) {
      var features = [];
      var self = this;
      collection.features.forEach(function(feature, index) {
        //if this layer should be excluded, skip it
        //path to exclude is this.layerproperties.layerName.excludeIdentify
        var layer = feature.id.split('.')[0];
        var exclude = self.attr(['layerProperties', layer, 'excludeIdentify'].join('.'));
        if (!exclude) {
          //otherwise, add the crs to each feature
          feature.crs = collection.crs;
          features.push(feature);
        }
      });
      var newCollection = can.extend(collection, {
        features: features
      });
      features = this.getFeaturesFromJson(newCollection);
      if (!this.attr('_features').length) {
        var index = this.getClosestFeatureIndex(features, coordinate);
        if (index) {
          //swap the feature for the first so it shows up first
          var temp = features[index];
          features[index] = features[0];
          features[0] = temp;
        }
      }
      this.attr('_features', this.attr('_features').concat(features));
    }
  },
  /**
   * Converts raw geojson into openlayers features
   * @signature
   * @param  {Object } collection Raw GeoJSON object
   * @return {ol.Collection<ol.Feature>}            The collection of openlayers features
   */
  getFeaturesFromJson: function(collection) {
    var proj = this.attr('mapModel').getMap().getView().getProjection();
    var gjson = new ol.format.GeoJSON();
    var features = gjson.readFeatures(collection, {
      dataProjection: gjson.readProjection(collection),
      featureProjection: proj
    });
    return features;
  },
  /**
   * Navigates the identify widget to the next feature by incrementing the active feature index
   * @signature
   * @return {can.Map} This object
   */
  gotoNext: function() {
    if (this.attr('_hasNextFeature')) {
      this.attr('_activeFeatureIndex', this.attr('_activeFeatureIndex') + 1);
    }
    return this;
  },
  /**
   * Navigates the identify widget to the previous feature by decrementing the active feature index
   * @signature
   * @return {can.Map} This object
   */
  gotoPrevious: function() {
    if (this.attr('_hasPreviousFeature')) {
      this.attr('_activeFeatureIndex', this.attr('_activeFeatureIndex') - 1);
    }
    return this;
  },
  /**
   * clears the features in this widget
   * @signature
   */
  clearFeatures: function() {
    if (this.attr('_loading').state() === 'pending') {
      this.attr('_deferreds').forEach(function(d) {
        if (d.state() === 'pending') {
          d.abort();
        }
      });
    }
    this.attr('_features').replace([]);
    this.updateSelectedFeature(null);
    this.attr('_activeFeatureIndex', 0);
  },
  /**
   * Updates the currently selected feature and replaces the table attributes and the vector layer with the new feature
   * @signature
   * @param  {ol.Feature} feature The feature
   */
  updateSelectedFeature: function(feature) {
    if (!feature) {
      if (this.attr('layer')) {
        this.attr('layer').getSource().clear();
      }
      return;
    }
    var source;
    if (this.attr('layer')) {
      source = this.attr('layer').getSource();
      source.clear();
      source.addFeature(feature);
      return;
    }
    source = new ol.source.Vector({
      features: [feature]
    });
    var layer = new ol.layer.Vector({
      title: 'Identify Results',
      id: this.attr('id'),
      source: source,
      excludeControl: true
    });
    this.attr('layer', layer);
    this.attr('mapModel.mapObject').addLayer(layer);
  },
  /**
   * Zooms the map to a feature
   * @signature
   * @param  {Object} object An object containing a feature property
   */
  zoomToFeature: function(object) {
    var extent = object.feature
      .getGeometry()
      .getExtent();

    if (this.attr('popupModel')) {
      var self = this;
      var key = this.attr('mapModel.mapObject').on('postrender', function() {
        self.attr('popupModel').centerPopup(ol.extent.getCenter(extent));
        self.attr('mapModel.mapObject').unByKey(key);
      });
    }

    this.animateZoomToExtent(extent);
  },
  /**
   * Zooms the map to an extent and creates the zoom animation
   * @signature
   * @param  {Array<Number>} extent The extent to zoom the map to
   */
  animateZoomToExtent: function(extent) {
    var map = this.attr('mapModel.mapObject');
    var duration = 750;
    var pan = ol.animation.pan({
      duration: duration,
      source: map.getView().getCenter()
    });
    var zoom = ol.animation.zoom({
      duration: duration,
      resolution: map.getView().getResolution()
    });
    map.beforeRender(pan, zoom);
    map.getView().fit(
      extent, map.getSize(), [50, 50, 50, 50]);
  },
  /**
   * An error logging function for failed ajax requests
   * @signature
   * @param  {Error} e The error
   */
  error: function(e) {
    this.attr('hasErrors', true);
    console.warn('Could not perform ajax request: ', e);
  },
  /**
   * finds the closest feature to the coordinate and returns that feature index
   * @signature
   * @param  {ol.feature[]} features The array of features to search through
   * @return {Number}          The index value of the closest feature
   */
  getClosestFeatureIndex: function(features, coord) {
    if (features.length === 0) {
      return 0;
    }
    var current = 0;
    var current_distance = 99999;
    var getDistance = this.getDistance;
    features.forEach(function(feature, index) {
      var center = ol.extent.getCenter(feature.getGeometry().getExtent());
      var distance = getDistance(center, coord);
      if (distance < current_distance) {
        current_distance = distance;
        current = index;
      }
    });
    return current;
  },
  /**
   * Gets the approximate distance value for two coordinates.
   * Not to be used for measuring as it uses a simple distance calculation
   * and does not take the earth's curvature into consideration
   * @signature
   * @param  {Number[]} c1 The first xy coordinate
   * @param  {Number[]} c2 The second xy coordinate
   * @return {Number}    The distance between the two points
   */
  getDistance: function(c1, c2) {
    return Math.sqrt(
      Math.pow((c1[0] - c2[0]), 2) +
      Math.pow((c1[1] - c2[1]), 2)
    );
  }
});

export default can.Component.extend({
  tag: 'identify-widget',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      var map, popup;
      if (this.viewModel.attr('mapNode')) {
        map = can.$(this.viewModel.attr('mapNode')).viewModel();
      }
      if (this.viewModel.attr('popupNode')) {
        popup = can.$(this.viewModel.attr('popupNode')).viewModel();
      }
      this.viewModel.initWidget({
        map: map,
        popup: popup
      });
    }
  }
});
