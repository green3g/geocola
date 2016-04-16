/*jshint esnext:true */
import CanMap from 'can/map/';
/**
 * @module {can.Map} providers/print/printProvider Print Provider
 * @parent geocola.providers
 * @description
 * A print provider is the basic lower level api that connects
 * the print widget to a print service. It provides a standard set of properties and methods that the print widget can use to connect to any print generator service.
 * @group printProvider.props Properties
 * @group printProvider.providers Print Providers
 */
export default CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * The print dpi setting
     * @parent printProvider.props
     * @property {Number} printProvider.props.dpi
     */
    dpis: {
      Value: can.List
    },
    /**
     * A list of layout strings
     * @parent printProvider.props
     * @property {Array<String>} printProvider.props.layouts
     */
    layouts: {
      Value: can.List
    },
    /**
     * A list of layout scales
     * @parent printProvider.props
     * @property {Array<Number>} printProvider.props.scales
     */
    scales: {
      Value: can.List
    },
    /**
     * A list of output file formats
     * @parent printProvider.props
     * @property {Array<String>} printProvider.props.outputFormats
     */
    outputFormats: {
      Value: can.List
    }
  },
  /**
   * Loads the capabilities and returns a promise that resolves to
   * the capabilities that were loaded. Upon loading the capabilities, the values describing the print services layouts, scales, etc should be populated.
   * @return {Promise} A promise that is resolved once the loading of the capabilities is complete.
   */
  loadCapabilities: function() {},

  /**
   * [function description]
   * @param  {printProvider.types.printOptions} options The print options
   * @return {printProvider.types.printResult}         A promise that resolves to a {printResult}
   */
  print: function(options) {}
});
