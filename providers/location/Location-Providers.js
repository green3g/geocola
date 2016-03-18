/*jshint esnext:true */

import Map from 'can/map/';
/**
 * @module {can.Map} providers.locationProvider Location Provider Spec
 * @parent Home.providers
 * @description
 * A location provider is the basic lower level api that connects
 * the location widget to a location/geolocater service. It provides a standard set of properties and methods that the print widget can use to connect to any print generator service.
 * @group providers.locationProvider.types Types
 */

/**
 * @typedef {locationObject} providers.locationProvider.types.locationObject LocationObject
 * @parent providers.locationProvider.types
 * @option {Number} x The x coordinate of the location
 * @option {Number} y The y coordinate of the location
 * @option {String} location The qualified name of the location
 */

/**
 * @typedef {suggestionsObject} providers.locationProvider.types.suggestionsObject SuggestionsObject
 * @parent providers.locationProvider.types
 * @option {Array.<String>} suggestions The array of suggestions
 * @option {Object} response The raw response from the geocode server
 */

can.Map.extend({
  /**
   * @prototype
   */
  /**
   * query the url for suggestions
   * @link providers.locationProvider.types.suggestionsObject suggestionsObject
   * @signature
   * @param  {string} searchText text to search for suggestions
   * @param  {float[]} point      x,y pair in latitude and longitude coordinates
   * @return {promise}            a promise resolved once the query completes. resolved with {suggestionsObject} suggestions
   */
  getSuggestions: function(searchText, point) {},
  /**
   * Retrieves the coordinates for a known location. This location is a fully qualified address or place name returned from the `getSuggestions` query.
   * @link providers.locationProvider.types.locationObject locationObject
   * @signature
   * @param  {String} knownLocation The location name
   * @return {Promise} A promise that is resolved to the {locationObject}
   */
  getLocation: function(knownLocation) {},

  /**
   * A helper function to cancel any pending queries.
   * @signature
   *
   */
  cancelPending: function() {}
});
