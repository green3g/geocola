/*jshint esnext: true */
import can from 'can';
import ol from 'openlayers';
import featureTemplate from './featureTemplate.stache!';
import template from './template.stache!';
import './styles.css!';
/**
 * @module identify-widget
 * @parent components
 * @group identify-widget.parameters Parameters
 * @group identify-widget.types Types
 * @group identify-widget.events Events
 * @group identify-widget.static Static
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
 * @option {identify-widget.types.fieldPropertiesObject} properties An object consisting of layerFieldProperties.
 */

/**
 * @typedef {fieldPropertiesObject} identify-widget.types.fieldPropertiesObject fieldPropertiesObject
 * An object consisting of a key representing the field name and the value being properties defining each field's appearance
 * @parent identify-widget.types
 * @option {String} alias The label to display for this field
 * @option {Boolean} exclude If set to true, this field will not display in the identify widget
 * @option {function(value)} formatter A formatter function for the field's value that will return a string and accept the value of the field as a parameter.
```
formatter: function(name) {
   return name + ' is Awesome!';
 }
 ```
 */
export const ViewModel = can.Map.extend({
  define: {
    /**
     * The selector for the `ol-map` map node.
     * @parent identify-widget.parameters
     * @signature `{String}` `map-node="#map"`
     * @property {String} mapNode
     */
    mapNode: {
      type: 'string'
    },
    /**
     * The selector for the `ol-popup` dom node
     * @parent identify-widget.parameters
     * @signature `{String}` `popup-node="#identify-popup"`
     */
    popupNode: {
      type: 'string'
    },
    /**
     * The max number of features to return for each layer. The default is 10.
     * @parent identify-widget.parameters
     * @signature `{Number}` `max-feature-count="10"`
     * @property {Number} maxFeatureCount
     */
    maxFeatureCount: {
      type: 'number',
      value: 10
    },
    /**
     * Buffer distance in pixels around the map click. The default is 10.
     * @parent identify-widget.parameters
     * @signature `{Number}` `feature-buffer="10"`
     * @property {Number} featureBuffer
     */
    featureBuffer: {
      type: 'number',
      value: 10
    },
    /**
     * Layer configuration properties
     * @parent identify-widget.parameters
     * @property {layerProperties}
     */
    layerProperties: {
      Value: can.Map
    },
    /**
     * The map click key to assign to this widget. When the map is clicked, and this key is the set as the current map click, it will trigger an identify.
     * @parent identify-widget.parameters
     * @property {Object}
     */
    mapClickKey: {
      type: 'string',
      value: 'identify'
    },
    /**
     * The list of features that have been identified
     * @parent identify-widget.parameters
     * @property {Array<ol.Feature>}
     */
    features: {
      Value: can.List
    },
    /**
     * Whether or not all identifies have completed. This is used internally by the template.
     * @parent identify-widget.parameters
     * @property {can.Deferred}
     */
    loading: {
      value: function() {
        var d = can.Deferred();
        d.resolve();
        return d;
      }
    },
    /**
     * A list of pending identify deferreds
     * @parent identify-widget.parameters
     * @property {Array<can.Deferred>}
     */
    deferreds: {
      Value: can.List,
    },
    /**
     * The currently selected feature index
     * @parent identify-widget.parameters
     * @property {Number}
     */
    activeFeatureIndex: {
      value: 0,
      type: 'number'
    },
    /**
     * If the feature list has one or more features after the selected feature, this will be true. This is used by the template to enable/disable the forward and back buttons.
     * @parent identify-widget.parameters
     * @property {Boolean}
     */
    hasNextFeature: {
      get: function() {
        return this.attr('activeFeatureIndex') < this.attr('features').length - 1;

      }
    },
    /**
     * If the feature list has one or more features before the selected feature, this will be true. This is used by the template to enable/disable the forward and back buttons.
     * @parent identify-widget.parameters
     * @property {Boolean}
     */
    hasPreviousFeature: {
      get: function() {
        return this.attr('activeFeatureIndex') > 0;
      }
    },
    /**
     * A virtual property that returns an object consisting of the formatted fields, values, and layer properties.
     * @parent identify-widget.parameters
     * @property {can.Map}
     */
    activeFeature: {
      get: function() {
        //if no features, return null
        if (!this.attr('features').length) {
          //update Map layer
          this.updateSelectedFeature(null);
          return null;
        }

        //get this active feature by array index
        var feature = this.attr('features')[this.attr('activeFeatureIndex')];

        //update Map layer
        this.updateSelectedFeature(feature);

        //get the layer key name. Layer id is returned from wms by LayerName.fetureID
        var layer = feature.getId().split('.');
        var index = layer[1];
        layer = layer[0];

        //get the configured layer properties object key this.layerProperties.layerName
        var layerProperties = ['layerProperties', layer].join('.');
        var template, fieldProperties, prop,
          attributes = {};
        var title;

        //if its provided parse the alias and formatters
        if (this.attr(layerProperties)) {

          //set the layer alias
          title = this.attr([layerProperties, 'alias'].join('.'));

          //set the correct template for this feature this.layerproperties.layername.template
          template = this.attr([layerProperties, 'template'].join('.'));
        }

        //get the field properties like alias and formatters this.layerproperties.layername.properties
        fieldProperties = this.attr([layerProperties, 'properties'].join('.'));
        var featureProperties = feature.getProperties();
        if (layerProperties && fieldProperties) {
          //build a new attribute list
          for (prop in featureProperties) {
            if (featureProperties.hasOwnProperty(prop) &&
              //if we don't have field properties for this layer or we do
              //and the exclude property is false or undefined, show this field
              (!fieldProperties || !fieldProperties.attr([prop, 'exclude'].join('.')))) {
              attributes[prop] = {

                //alias defaults to the property name if not provided
                alias: fieldProperties.attr([prop, 'alias'].join('.')) || prop,

                //value gets formatted if there's a formatter function
                value: typeof fieldProperties.attr([prop, 'formatter'].join('.')) === 'function' ?
                  fieldProperties.attr([prop, 'formatter'].join('.'))(featureProperties[prop], featureProperties) : can.esc(featureProperties[prop]),

                //rawValue in case you need access to it
                rawValue: featureProperties[prop]
              };
            }
          }
        } else {
          //if we don't have a layerProperties for this layer, build a simpler
          //attribute list
          for (prop in featureProperties) {
            if (featureProperties.hasOwnProperty(prop) &&
              //if we don't have field properties for this layer or we do
              //and the exclude property is false or undefined, show this field
              (!fieldProperties || !fieldProperties.attr([prop, 'exclude'].join('.')))) {
              attributes[prop] = {
                alias: prop,
                value: featureProperties[prop],
                rawValue: featureProperties[prop]
              };
            }
          }
        }

        //show popup if used
        if (this.attr('popupModel')) {
          var self = this;
          //there seems to be a bug when loading geojson features
          var extent = feature
            .getGeometry()
            .getExtent();
          self.attr('popupModel').centerPopup(ol.extent.getCenter(extent));
        }
        return {
          feature: feature,
          featureTemplate: template || featureTemplate,
          defaultTemplate: featureTemplate,
          attributes: attributes,
          layer: layer,
          title: title || layer,
          index: index
        };
      }
    },
  },
  /**
   * [function description]
   * @param  {[type]} models [description]
   * @return {[type]}        [description]
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
   * [function description]
   * @param  {[type]} event      [description]
   * @param  {[type]} coordinate [description]
   * @return {[type]}            [description]
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
    this.attr('loading', can.Deferred());
    urls.forEach(function(url) {
      var def = self.getFeatureInfo(url);
      deferreds.push(def);
    });
    if (!deferreds.length) {
      this.attr('loading').resolve([]);
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
    this.attr('deferreds', deferreds);
    return this.attr('loading').promise();
  },
  /**
   *
   *
   * @param  {[type]} resolved [description]
   * @param  {[type]} total    [description]
   * @return {[type]}          [description]
   */
  updateLoading: function(resolved, total) {
    if (resolved === total) {
      this.attr('loading').resolve(this.attr('features'));
    }
  },
  /**
   * [function description]
   * @param  {[type]} layers     [description]
   * @param  {[type]} coordinate [description]
   * @return {[type]}            [description]
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
   * [function description]
   * @param  {[type]} layer      [description]
   * @param  {[type]} coordinate [description]
   * @return {[type]}            [description]
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
   * [function description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  getFeatureInfo: function(url) {
    return can.ajax({
      url: url,
      dataType: 'json',
      method: 'GET'
    });
  },
  /**
   * [function description]
   * @param  {[type]} collection [description]
   * @return {[type]}            [description]
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
      if (!this.attr('features').length) {
        var index = this.getClosestFeatureIndex(features, coordinate);
        if (index) {
          //swap the feature for the first so it shows up first
          var temp = features[index];
          features[index] = features[0];
          features[0] = temp;
        }
      }
      this.attr('features', this.attr('features').concat(features));
    }
  },
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
   * [function description]
   * @return {[type]} [description]
   */
  gotoNext: function() {
    if (this.attr('hasNextFeature')) {
      this.attr('activeFeatureIndex', this.attr('activeFeatureIndex') + 1);
    }
    return this;
  },
  /**
   * [function description]
   * @return {[type]} [description]
   */
  gotoPrevious: function() {
    if (this.attr('hasPreviousFeature')) {
      this.attr('activeFeatureIndex', this.attr('activeFeatureIndex') - 1);
    }
    return this;
  },
  /**
   * [function description]
   * @return {[type]} [description]
   */
  clearFeatures: function() {
    if (this.attr('loading').state() === 'pending') {
      this.attr('deferreds').forEach(function(d) {
        if (d.state() === 'pending') {
          d.abort();
        }
      });
    }
    this.attr('features').replace([]);
    this.updateSelectedFeature(null);
    this.attr('activeFeatureIndex', 0);
  },
  /**
   * [function description]
   * @param  {[type]} feature [description]
   * @return {[type]}         [description]
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
   * [function description]
   * @param  {[type]} object [description]
   * @return {[type]}        [description]
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
   * [function description]
   * @param  {[type]} extent [description]
   * @return {[type]}        [description]
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
   * [function description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
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
