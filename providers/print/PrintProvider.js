/*jshint esnext:true */
import Map from 'can/map/';
/**
 * @module {can.Map} providers.printProvider Print Provider Spec
 * @parent Home.providers
 * @description
 * A print provider is the basic lower level api that connects
 * the print widget to a print service. It provides a standard set of properties and methods that the print widget can use to connect to any print generator service.
 * @group providers.printProvider.types Types
 * @group providers.printProvider.properties Properties
 */
export default Map.extend({
  define: {
    /**
     * The print dpi setting
     * @parent providers.printProvider.properties
     * @property {Number}
     */
    dpis: {
      Value: can.List
    },
    /**
     * A list of layout strings
     * @parent providers.printProvider.properties
     * @property {Array<String>}
     */
    layouts: {
      Value: can.List
    },
    /**
     * A list of layout scales
     * @parent providers.printProvider.properties
     * @property {Array<Number>}
     */
    scales: {
      Value: can.List
    },
    /**
     * A list of output file formats
     * @parent providers.printProvider.properties
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
   * @typedef {printOptions} providers.printProvider.types.printOptions printOptions
   * @parent providers.printProvider.types
   * Required options sent to the print function of a print provider
   * @option {ol.Map} map The openlayers map object to print
   * @option {String} layout The layout to print the map to
   * @option {String} title The title to send to the print server
   * @option {number} dpi The dpi setting to use in generating the printout
   */
  /**
   * @typedef {printResult} providers.printProvider.types.printResult printResult
   * @parent providers.printProvider.types
   * @option {String} error If an error occurs this property will contain the error. The title property will contain a user friendly error message.
   * @option {String} title The printout title or title of the error
   * @option {String} url The url to the print result
   */
  /**
   * [function description]
   * @param  {providers.printProvider.types.printOptions} options The print options
   * @return {providers.printProvider.types.printResult}         A promise that resolves to a {printResult}
   */
  print: function(options) {}
});
