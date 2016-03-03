/*jshint esnext: true */
import can from 'can';

import template from './locator.stache!';
import './locator.css!';
import widgetModel from 'components/widget-model';
import icon from './icon';

/**
 * @module locator-widget
 * @parent components
 */
export const ViewModel = widgetModel.extend({
  define: {
    /**
     * @property {string} addressValue
     * The default address value for the textbox.
     */
    addressValue: {
      value: null,
      type: 'string'
    },
    /**
     * @property {string}
     * the url to geocode to for find and suggest endpoints
     */
    url: {
      value: null,
      type: 'string'
    },
    /**
     * @property {number}
     * the default level of zoom to apply if using an ol-map
     */
    zoomLevel: {
      value: 18,
      type: 'number'
    },
    /**
     * whether or not to navigate the map
     * @property {boolean}
     */
    navigate: {
      type: 'boolean',
      value: true
    },
    /**
     * a geocoder service provider
     * @property {Object}
     */
    provider: {},
    /**
     * @property {can.List}
     * current suggestions in the widget
     */
    suggestions: {
      Value: can.List
    },
    /**
     * the current location found by the widget
     * @property {Object}
     */
    location: {
      Value: can.Map
    },
    loading: {
      value: function(){
        return can.Deferred().resolve();
      }
    }
  },
  initMap: function(mapViewModel) {
    mapViewModel.ready().then(this.onMapReady.bind(this));
  },
  onMapReady: function(map) {
    this.attr('map', map);
    this.attr('vectorLayer', new ol.layer.Vector({
      title: 'Location',
      id: 'location' + this.attr('instanceId'),
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon( /* @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: icon
        }))
      })
    }));
  },
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
      this.attr('loading', provider.getSuggestions(address, point));
      this.attr('loading').then(this.updateSuggestions.bind(this));
    }
  },
  selectAddress: function(address) {
    this.attr('addressValue', address);
    this.attr('loading', this.attr('provider').getLocation(address));
    this.attr('loading').then(this.handleAddressLocated.bind(this));
  },
  clearAddress: function() {
    this.attr('addressValue', null);
    this.clearSuggestions();
    this.clearGraphics();
    this.dispatch('address-cleared');
  },
  updateSuggestions: function(results) {
    if (results.suggestions != this.attr('suggestions')) {
      this.attr('suggestions').replace(results.suggestions);
      this.dispatch('suggestions-found', [results.suggestions]);
    }
  },
  clearSuggestions: function() {
    this.attr('suggestions').replace([]);
    this.dispatch('suggestions-cleared');
  },
  clearGraphics: function() {
    if (this.attr('map')) {
      this.attr('map').removeLayer(this.attr('vectorLayer'));
      this.attr('vectorLayer').getSource().clear();
    }
  },
  handleAddressLocated: function(location) {
    this.clearSuggestions();
    this.attr('location', location);
    this.dispatch('location-found', [location]);
    if (this.attr('navigate') && this.attr('map')) {
      this.navigateMap(location);
    }
  },
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

export default can.Component.extend({
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
