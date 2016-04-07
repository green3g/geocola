/*jshint esnext:true */
import Map from 'can/map/';
/**
 * @module {can.Map} printProvider Print Provider
 * @parent Home.providers
 * @description
 * A print provider is the basic lower level api that connects
 * the print widget to a print service. It provides a standard set of properties and methods that the print widget can use to connect to any print generator service.
 * @group printProvider.types Types
 * @group printProvider.properties Properties
 * @group printProvider.providers Print Providers
 */
export default Map.extend({
  define: {
    /**
     * The print dpi setting
     * @parent printProvider.properties
     * @property {Number}
     */
    dpis: {
      Value: can.List
    },
    /**
     * A list of layout strings
     * @parent printProvider.properties
     * @property {Array<String>}
     */
    layouts: {
      Value: can.List
    },
    /**
     * A list of layout scales
     * @parent printProvider.properties
     * @property {Array<Number>}
     */
    scales: {
      Value: can.List
    },
    /**
     * A list of output file formats
     * @parent printProvider.properties
     * @property {Array<String>}
     */
    outputFormats: {
      Value: can.List
    }
  },
  /**
   * @prototype
   */
  /**
   * Loads the capabilities and returns a promise that resolves to
   * the capabilities that were loaded. Upon loading the capabilities, the values describing the print services layouts, scales, etc should be populated.
   * @return {Promise} A promise that is resolved once the loading of the capabilities is complete.
   */
  loadCapabilities: function() {},
  /**
   * @typedef {printOptions} printProvider.types.printOptions printOptions
   * @parent printProvider.types
   * Required options sent to the print function of a print provider
   * @option {ol.Map} map The openlayers map object to print
   * @option {String} layout The layout to print the map to
   * @option {String} title The title to send to the print server
   * @option {number} dpi The dpi setting to use in generating the printout
   */
  /**
   * @typedef {printResult} printProvider.types.printResult printResult
   * @parent printProvider.types
   * @option {String} error If an error occurs this property will contain the error. The title property will contain a user friendly error message.
   * @option {String} title The printout title or title of the error
   * @option {String} url The url to the print result
   */
  /**
   * [function description]
   * @param  {printProvider.types.printOptions} options The print options
   * @return {printProvider.types.printResult}         A promise that resolves to a {printResult}
   */
  print: function(options) {}
});
