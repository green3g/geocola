/* jshint esnext:true */
import can from 'can';
/**
 * @constructor providers/location/EsriGeocoder EsriGeocoder
 * @parent locationProvider.providers
 * @group EsriGeocoder.props Properties
 * @description
 * Provides abstraction for Esri's ArcGIS Online or ArcGIS for Server geocoders
 */
export default can.Map.extend({
  define: {
    /**
     * The url of the esri geocoder
     * @property {String} EsriGeocoder.props.url
     * @parent EsriGeocoder.props
     */
    url: {
      type: 'string'
    },
    /**
     * The max number of locations to return. The default is 5.
     * @property {Number} EsriGeocoder.props.maxLocations
     * @parent EsriGeocoder.props
     */
    maxLocations: {
      value: 5
    },
    /**
     * An optional point to send to the ArcGIS Geocoder to begin searching from.
     * @property {Number[]} EsriGeocoder.props.searchPoint
     * @parent EsriGeocoder.props
     */
    searchPoint: {
      value: null
    }
  },
  /**
   * @prototype
   */
  /**
   * query the url for suggestions
   * @link suggestionsObject suggestionsObject
   * @signature
   * @param  {string} searchText text to search for suggestions
   * @param  {float[]} point      x,y pair in latitude and longitude coordinates
   * @return {promise}            a promise resolved once the query completes. resolved with {suggestionsObject} suggestions
   */
  getSuggestions: function(searchText, point) {
    this.attr('deferred', can.Deferred());
    this.attr('_deferred', can.ajax({
      url: this.attr('url') + '/suggest',
      data: {
        f: 'json',
        text: searchText,
        location: point ? point.join(',') : this.attr('searchPoint') ? this.attr('searchPoint').join(',') : null,
        maxLocations: this.attr('maxLocations')
      },
      dataType: 'json',
      method: 'GET'
    }));
    this.attr('_deferred').then(this._resolveSuggestions.bind(this));
    return this.attr('deferred').promise();
  },
  /**
   * Retrieves the coordinates for a known location. This location is a fully qualified address or place name returned from the `getSuggestions` query.
   * @link locationObject locationObject
   * @signature
   * @param  {String} knownLocation The location name
   * @return {Promise} A promise that is resolved to the locationObject
   */
  getLocation: function(knownLocation) {
    this.attr('deferred', can.Deferred());
    this.attr('_deferred', can.ajax({
      url: this.attr('url') + '/find',
      data: {
        f: 'json',
        text: knownLocation
      },
      method: 'GET',
      dataType: 'json'
    }));
    this.attr('_deferred').then(this._resolveLocation.bind(this));
    return this.attr('deferred').promise();
  },
  /**
   * A helper function to cancel any pending queries.
   * @signature
   *
   */
  cancelPending: function() {
    var def = this.attr('deferred');
    if (this.attr('_deferred') && this.attr('_deferred').state() === 'pending') {
      def.reject();
      this.attr('_deferred').abort();
    }
  },
  /**
   * A helper function which resolves the suggestions promise
   * to a object containing suggestions.
   * @link suggestionsObject suggestionsObject
   * @signature
   * @param  {object} results The raw Esri suggestions response
   */
  _resolveSuggestions: function(results) {
    var suggestions = results.suggestions.map(function(sug) {
      return sug.text;
    });
    this.attr('deferred').resolve({
      suggestions: suggestions,
      response: results
    });
  },
  /**
   * A helper function which resolves the location promise to a geographic location object.
   * @link locationObject locationObject
   * @signature
   * @param  {object} results The raw geocode response from Esri
   */
  _resolveLocation: function(results) {
    var location = results.locations[0];
    this.attr('deferred').resolve({
      location: location.name,
      x: location.feature.geometry.x,
      y: location.feature.geometry.y,
      response: results
    });
  }
});
