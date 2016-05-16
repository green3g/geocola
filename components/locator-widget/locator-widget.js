import can from 'can/util/library';
import List from 'can/list/';
import CanMap from 'can/map/';
import 'can/map/define/';
import Component from 'can/component/';

import template from './locator.stache!';
import './locator.css!';
import widgetModel from '../widget-model';
import icon from './icon';

/**
 * @constructor components/locator-widget.ViewModel ViewModel
 * @parent components/locator-widget
 * @group components/locator-widget.ViewModel.props Properties
 *
 * @description A `<locator-widget />` component's ViewModel
 */
export const ViewModel = widgetModel.extend({
  define: {
    /**
    * The default address value for the textbox.
     * @property {String} components/locator-widget.ViewModel.props.addressValue
     * @parent components/locator-widget.ViewModel.props
     */
    addressValue: {
      value: null,
      type: 'string'
    },
    /**
    * the url to geocode to for find and suggest endpoints
     * @property {String} components/locator-widget.ViewModel.props.url
     * @parent components/locator-widget.ViewModel.props
     */
    url: {
      value: null,
      type: 'string'
    },
    /**
    * The default level of zoom to apply if using an ol-map. The default is `18`
     * @property {Number} components/locator-widget.ViewModel.props.zoomLevel
     * @parent components/locator-widget.ViewModel.props
     */
    zoomLevel: {
      value: 18,
      type: 'number'
    },
    /**
     * whether or not to navigate the map
     * @property {Boolean} components/locator-widget.ViewModel.props.navigate
     * @parent components/locator-widget.ViewModel.props
     */
    navigate: {
      type: 'boolean',
      value: true
    },
    /**
     * a geocoder service provider
     * @property {providers.locationProvider} components/locator-widget.ViewModel.props.provider
     * @link providers.locationProvider Location Providers
     * @parent components/locator-widget.ViewModel.props
     */
    provider: {},
    /**
     * @property {Array<providers.locationProvider.types.suggestionsObject>} components/locator-widget.ViewModel.props.suggestions
     * current suggestions in the widget
     * @parent components/locator-widget.ViewModel.props
     */
    suggestions: {
      Value: List
    },
    /**
     * the current location found by the widget
     * @property {Object} components/locator-widget.ViewModel.props.location
     * @parent components/locator-widget.ViewModel.props
     */
    location: {
      Value: CanMap
    },
    /**
     * A deferred representing the current _loading state
     * @property {can.Deferred} components/locator-widget.ViewModel.props._loading
     * @parent components/locator-widget.ViewModel.props
     */
    _loading: {
      value: function(){
        return can.Deferred().resolve();
      }
    }
  },
  /**
   * @prototype
   */
  /**
   * Initilizes this widget when the item is inserted. Locates the ol-map component and binds to its ready event.
   * @signature
   * @param  {can.Map} mapViewModel The map viewModel
   */
  initMap: function(mapViewModel) {
    mapViewModel.ready().then(this.onMapReady.bind(this));
  },
  /**
   * When the map is ready, this is called internally to add a new vector layer to it and stores a reference to the map.
   * @signature
   * @param  {can.Map} map The map viewModel
   */
  onMapReady: function(map) {
    this.attr('map', map);
    this.attr('vectorLayer', new ol.layer.Vector({
      title: 'Location',
      id: 'location' + this.attr('instanceId'),
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon( /* @property {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: icon
        }))
      })
    }));
  },
  /**
   * Called when the search text changes to retrieve suggestions
   * @param  {String} address The text string to search for suggestions
   */
  searchAddressValue: function(address) {
    this.clearSuggestions();
    this.clearGraphics();
    var self = this;
    var point;
    if (this.attr('map')) {
      var view = this.attr('map').getView();
      point = ol.proj.transform(view.getCenter(),
        view.getProjection(), 'EPSG:4326');
    }
    if (address.length && address.length > 5) {
      var provider = this.attr('provider');
      provider.cancelPending();
      this.attr('_loading', provider.getSuggestions(address, point));
      this.attr('_loading').then(this.updateSuggestions.bind(this));
    }
  },
  /**
   * Called when one of the suggestions is clicked. This function kicks off the geocode by querying the provider with the qualified address or location name.
   * @signature
   * @param  {String} address The fully qualified address or string name
   */
  selectAddress: function(address) {
    this.attr('addressValue', address);
    this.attr('_loading', this.attr('provider').getLocation(address));
    this.attr('_loading').then(this.handleAddressLocated.bind(this));
  },
  /**
   * @typedef {can.Event} locator-widget.events.addressCleared address-cleared
   * @parent locator-widget.events
   * An event dispatched when the the address is cleared using the clear button
   */
  /**
   * Clears the suggestions, address value, and any graphics on the layer if it exists. Dispatches event `address-cleared`
   * @signature
   */
  clearAddress: function() {
    this.attr('addressValue', null);
    this.clearSuggestions();
    this.clearGraphics();
    this.dispatch('address-cleared');
  },
  /**
   * @typedef {can.Event} locator-widget.events.suggestionsFound suggestions-found
   * @parent locator-widget.events
   * An event dispatched when suggestions are found from the provider
   * @option {Array.<String>} suggestions The suggestions that were found by the provider
   */
  /**
   * Called internally to update the suggestions list when suggestions are found by the provider. Dispatches event `suggestions-found` with the array of suggestions
   * @signature
   * @param  {providers.locationProvider.types.suggestionsObject} results An array of string results
   */
  updateSuggestions: function(results) {
    if (results.suggestions != this.attr('suggestions')) {
      this.attr('suggestions').replace(results.suggestions);
      this.dispatch('suggestions-found', [results.suggestions]);
    }
  },
  /**
   * @typedef {can.Event} locator-widget.events.suggestionsCleared suggestions-cleared
   * @parent locator-widget.events
   * An event dispatched when the the suggestions are cleared from the widget
   */
  /**
   * Empties the list of suggestions-cleared
   * @signature
   */
  clearSuggestions: function() {
    this.attr('suggestions').replace([]);
    this.dispatch('suggestions-cleared');
  },
  /**
   * Clears the graphics layer
   * @signature
   */
  clearGraphics: function() {
    if (this.attr('map')) {
      this.attr('map').removeLayer(this.attr('vectorLayer'));
      this.attr('vectorLayer').getSource().clear();
    }
  },
  /**
   * @typedef {can.Event} locator-widget.events.locationFound location-found
   * @parent locator-widget.events
   * An event dispatched when the the location is found by the provider
   * @option {providers.locationProvider.types.locationObject} location The location found by the provider
   */
  /**
   * Called internally when the address is resolved to a location by the provider
   * @signature
   * @param  {providers.locationProvider.types.locationObject} location The location object
   */
  handleAddressLocated: function(location) {
    this.clearSuggestions();
    this.attr('location', location);
    this.dispatch('location-found', [location]);
    if (this.attr('navigate') && this.attr('map')) {
      this.navigateMap(location);
    }
  },
  /**
   * Pans the map to the location and adds a point to the graphics layer
   * @signature
   * @param  {providers.locationProvider.types.locationObject} location The location object
   */
  navigateMap: function(location) {
    var map = this.attr('map');
    var coords = ol.proj.transform([location.x, location.y],
      'EPSG:4326', map.getView().getProjection());
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
    map.getView().setCenter(coords);
    map.getView().setZoom(this.attr('zoomLevel'));
    this.attr('map').addLayer(this.attr('vectorLayer'));
    this.attr('vectorLayer').getSource().addFeature(new ol.Feature({
      geometry: new ol.geom.Point(coords)
    }));
  }
});

export default Component.extend({
  viewModel: ViewModel,
  template: template,
  tag: 'locator-widget',
  events: {
    inserted: function() {
      if (this.viewModel.attr('mapNode')) {
        var mapViewModel = can.$(this.viewModel.attr('mapNode')).viewModel();
        this.viewModel.initMap(mapViewModel);
      }
    }
  }
});
