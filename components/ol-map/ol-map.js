/* jshint esnext: true */

import can from 'can';
import ol from 'openlayers';
import widgetModel from 'components/widget-model';
import template from './olMap.stache!';
import './olMap.css!';
/**
 * @module ol-map
 * @parent Home.components
 * @group ol-map.props Properties
 * @inherits widgetModel
 * @signature `<ol-map />` Example:

  ```html
  <ol-map attribute="...">
    <child-components />
  </ol-map>`
  ```
 * @body
 ## Description
 A openlayers map component that provides a wrapper for `ol.Map` along with additional functionality. This ol-map component provides a centralized map click handler so that different widgets may activate and deactivate their map click event. Several widgets use and require a reference to an ol-map component via a map-node attribute.

 ## Using complex map options
 When the template is rendered using `can.view('<ol-map....', ...)` map options can be supplied in a variety of ways. For complex configuration that might use custom controls or advanced settings not provided by this wrapper, a setup similar to the example below may be used. This example uses  [`can.view.bindings`](http://canjs.com/docs/can.view.bindings.html).

 ```html
 <!--app-template.stache-->
 <ol-map id="main-map" {map-options}="mapOptions">
 <!-- ... -->
 </ol-map>
 ```

 ```javascript
 //app.js
 //Note: target is automatically supplied by the component
 import template from './app-template.stache!';
 import ol from 'openlayers';

 $('#app').html(can.view(template, {
   mapOptions: {
     layers: [
         new ol.layer.Tile({
           source: new ol.source.OSM()
         })
       ],
       view: new ol.View({
         center: [10, 30],
         zoom: 13
       })
     }
 }));
 ```
 */

export const ViewModel = widgetModel.extend({
  define: {
    /**
     * Openlayers projection string to use for map. The default is `'EPSG:3857'`
     * @property {string} ol-map.props.projection
     * @parent ol-map.props
     * @signature `projection="EPSG:3857"` sets the projection value
     */
    projection: {
      type: 'string',
      value: 'EPSG:3857'
    },
    /**
     * The starting x coordinate of the map view. The default is 0.
     * @property {Number} ol-map.props.x
     * @parent ol-map.props
     * @signature `x="45.2123"` Sets the x value
     */
    x: {
      type: 'number',
      value: 0
    },
    /**
     *
     * The starting y coordinate of the map view. The default is 0.
     * @property {Number} ol-map.props.y
     * @parent ol-map.props
     *
     */
    y: {
      type: 'number',
      value: 0
    },
    /**
     * The starting zoom level of the map view. The default is 1.
     * @property {Number} ol-map.props.zoom
     * @parent ol-map.props
     * @signature `zoom="5"` Sets the zoom level
     * @signature `viewModel.attr('zoom', 5)` Sets the zoom level
     *
     */
    zoom: {
      type: 'number',
      value: 1
    },
    /**
     * The default name of the map click handler to use. If not supplied, it
     * will be set to the first one added.
     * @property {String} ol-map.props.defaultClick
     * @parent ol-map.props
     */
    defaultClick: {
      type: 'string'
    },
    /**
     * The array of current click handlers in the widget.
     * @property {can.Map} ol-map.props.clickHandlers
     * @parent ol-map.props
     */
    clickHandlers: {
      Value: can.Map
    },
    /**
     * @description
     * The deferred object used to notify listeners when the map is ready
     * @property {can.Deferred} ol-map.props.deferred
     * @parent ol-map.props
     */
    deferred: {
      value: can.Deferred
    },
    /**
     * @description
     * Optional map options to override the defaults
     * @property {object} ol-map.props.mapOptions
     * @parent ol-map.props
     */
    mapOptions: {
      type: '*'
    },
    /**
     * The ol.Map
     * @property {ol.Map} ol-map.props.mapObject
     * @parent ol-map.props
     */
    mapObject: {
      value: null
    }
  },
  /**
   * @prototype
   */
  /**
   * @description
   * Initializes the map
   * @signature
   * @param  {domElement} element The dom element to place the map
   */
  initMap: function(element) {
    var projection = ol.proj.get(this.attr('projection'));
    var view = new ol.View({
      zoom: this.attr('zoom'),
      projection: projection,
      center: [this.attr('x'), this.attr('y')]
    });
    var options = {
      layers: new ol.Collection([]),
      controls: ol.control.defaults().extend([
        new ol.control.OverviewMap(),
        new ol.control.FullScreen()
      ]),
      target: element,
      view: view
    };
    if (this.attr('mapOptions')) {
      options = can.extend(options, this.attr('mapOptions'));
    }
    //create the map, resolve the deferred
    this.attr('mapObject', this.createMap(options));
    this.attr('deferred').resolve(this.attr('mapObject'));
  },
  /**
   * @description
   * Returns a promise resolved when this widget's map is ready
   * @signature
   * @return {promise} A promise that is resolved with the `ol.map` object when the map is ready
   */
  ready: function() {
    return this.attr('deferred').promise();
  },
  /**
   * @description
   * adds a layer to the `ol.map` when it is ready
   *
   * @signature
   * @param  {ol.layer} layer the layer object to add
   */
  addLayer: function(layer) {
    this.ready().then(function(map) {
      var layers = map.getLayers();
      layers.insertAt(0, layer);
    });
  },
  /**
   * @description
   * Creates and initializes the map with the map options. Called internally.
   * @signature
   * @param  {object} options `ol.map` constructor options
   * @return {ol.map}         The map object that is now set up
   */
  createMap: function(options) {
    var map = new ol.Map(options);
    map.on('click', this.onMapClick.bind(this));
    map.on('change:size', this.onResize.bind(this));
    return map;
  },
  /**
   * @description
   * A function to easily access the map
   * @signature
   * @return {ol.map} The map object
   */
  getMap: function() {
    return this.attr('mapObject');
  },
  /**
   *  @description
   * Adds a new click handler to the managed click
   * handlers in this widget.If the click handler exists,
   * a warning will be logged.If this is the first click
   * handler added, it will automatically be set as the default.
   *
   * @signature
   * @param {string} name - the name of the handler
   * @param {function(event)} handler - the handler funciton that is passed the `ol.event`
   * for the map click
   */
  addClickHandler: function(name, handler) {
    if (this.attr('clickHandlers.' + name)) {
      console.warn('click handler already exists for key ' + name);
      return;
    }
    if (typeof handler === 'function') {
      this.attr(['clickHandlers', name].join('.'), handler);
      if (!this.attr('defaultClick')) {
        this.attr('defaultClick', name);
      }
      if (!this.attr('currentClick')) {
        this.attr('currentClick', this.attr('defaultClick'));
      }
    }
    return this;
  },
  /**
   * @description
   * Removes a click handler
   *
   * @signature
   * @param  {String} name The name of the click handler to remove
   * @return {this}      `this` object
   */
  removeClickHandler: function(name) {
    this.removeAttr('clickHandlers.' + name);
    if (this.attr('defaultClick') === name) {
      this.attr('defaultClick', null);
    }
    if (this.attr('currentClick') === name) {
      this.setDefaultClickHandler();
    }
    return this;
  },
  resize: function() {
    this.attr('mapObject').updateSize();
  },
  /**
   * @description
   * Sets the current click handler to the key provided if it exists
   * @signature
   * @param  {String} newCurrent The new current click handler to set
   * @return {this}            `this` object
   */
  setCurrentClickHandler: function(newCurrent) {
    if (this.attr('clickHandlers.' + newCurrent)) {
      this.attr('currentClick', newCurrent);
    }
    return this;
  },
  /**
   * @description
   * Returns the current click handler to the default click handler
   * @signature
   * @return {this} this object
   */
  setDefaultClickHandler: function() {
    this.attr('currentClick', this.attr('defaultClick'));
    return this;
  },
  /**
   * @description
   * The map click handler that delegates which function should be called.
   * This is the only map click handler that gets assigned to the `map.on('click')`
   * Once the current click is evaluated as a function, it calls it and returns
   * the value (if any)
   * @signature
   * @param  {Event} evt The ol map click event
   * @return {*} The return value of the current click handler
   */
  onMapClick: function(evt) {
    if (!this.attr('currentClick')) {
      console.warn('no mapclick defined');
      return;
    }
    var path = 'clickHandlers.' + this.attr('currentClick');
    return this.attr(path)(evt);
  },
  /**
   * @description
   * Dispatches resize event when the map is resized
   * @signature
   * @param  {Event} event The openlayers map resize event
   *
   */
  onResize: function(event) {
    this.dispatch('resize', this.attr('mapObject').getSize());
  }
});

export default can.Component.extend({
  tag: 'ol-map',
  viewModel: ViewModel,
  template: template,
  events: {
    inserted: function() {
      this.scope.initMap(this.element.find('.ol-map-container')[0]);
    }
  }
});
