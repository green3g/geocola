import can from 'can/util/library';
import CanMap from 'can/map/';
import 'can/map/define/';
import Component from 'can/component/';
import ol from 'openlayers';
import widgetModel from '../widget-model';
import template from './olMap.stache!';
import './olMap.css!';

import Factory from './LayerFactory';

/**
 * @constructor components/ol-map.ViewModel ViewModel
 * @parent components/ol-map
 * @group components/ol-map.ViewModel.props Properties
 *
 * @description A `<ol-map />` component's ViewModel
 */
export const ViewModel = widgetModel.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Openlayers projection string to use for map. The default is `'EPSG:3857'`
     * @property {string} components/ol-map.ViewModel.props.projection
     * @parent components/ol-map.ViewModel.props
     * @signature `projection="EPSG:3857"` sets the projection value
     */
    projection: {
      type: 'string',
      value: 'EPSG:3857'
    },
    /**
     * The starting x coordinate of the map view. The default is 0.
     * @property {Number} components/ol-map.ViewModel.props.x
     * @parent components/ol-map.ViewModel.props
     * @signature `x="45.2123"` Sets the x value
     */
    x: {
      type: 'number',
      value: 0
    },
    /**
     *
     * The starting y coordinate of the map view. The default is 0.
     * @property {Number} components/ol-map.ViewModel.props.y
     * @parent components/ol-map.ViewModel.props
     *
     */
    y: {
      type: 'number',
      value: 0
    },
    /**
     * The starting zoom level of the map view. The default is 1.
     * @property {Number} components/ol-map.ViewModel.props.zoom
     * @parent components/ol-map.ViewModel.props
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
     * @property {String} components/ol-map.ViewModel.props.defaultClick
     * @parent components/ol-map.ViewModel.props
     */
    defaultClick: {
      type: 'string'
    },
    /**
     * The array of current click handlers in the widget.
     * @property {can.Map} components/ol-map.ViewModel.props.clickHandlers
     * @parent components/ol-map.ViewModel.props
     */
    clickHandlers: {
      Value: CanMap
    },
    /**
     * @description
     * The deferred object used to notify listeners when the map is ready
     * @property {can.Deferred} components/ol-map.ViewModel.props.deferred
     * @parent components/ol-map.ViewModel.props
     */
    deferred: {
      value: can.Deferred
    },
    /**
     * @description
     * Optional map options to override the defaults
     * @property {object} components/ol-map.ViewModel.props.mapOptions
     * @parent components/ol-map.ViewModel.props
     */
    mapOptions: {
      Value: CanMap
    },
    /**
     * The ol.Map
     * @property {ol.Map} components/ol-map.ViewModel.props.mapObject
     * @parent components/ol-map.ViewModel.props
     */
    mapObject: {
      value: null
    }
  },
  /**
   * @description
   * Initializes the map
   * @signature
   * @param  {domElement} element The dom element to place the map
   */
  initMap: function(element) {
    this.attr('mapOptions.layers', this.getLayers(this.attr('mapOptions.layers')));
    this.attr('mapOptions.view', this.getView(this.attr('mapOptions.view')));

    var options = can.extend({
      controls: ol.control.defaults().extend([
        new ol.control.OverviewMap(),
        new ol.control.FullScreen()
      ]),
      target: element,
    }, this.attr('mapOptions').attr());
    if (this.attr('mapOptions')) {
      options = can.extend(options, this.attr('mapOptions'));
    }
    //create the map, resolve the deferred
    this.attr('mapObject', this.createMap(options));
    this.attr('deferred').resolve(this.attr('mapObject'));
  },
  getLayers: function(layerConf){
    var layers = [];
    layerConf.reverse().forEach(function(l){
      layers.push(Factory.getLayer(l));
    });
    return new ol.Collection(layers);
  },
  getView: function(viewConf){
    var projection = ol.proj.get(this.attr('projection'));
    return new ol.View(can.extend({
      zoom: this.attr('zoom'),
      projection: projection,
      center: [this.attr('x'), this.attr('y')]
    }, viewConf));
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

export default Component.extend({
  tag: 'ol-map',
  viewModel: ViewModel,
  template: template,
  events: {
    inserted: function() {
      this.scope.initMap(this.element.find('.ol-map-container')[0]);
    }
  }
});
