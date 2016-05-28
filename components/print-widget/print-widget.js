import can from 'can/util/library';
import Component from 'can/component/';
import template from './print.stache!';
import widgetModel from '../widget-model';

/**
 * @constructor components/print-widget.ViewModel ViewModel
 * @parent components/print-widget
 * @group components/print-widget.ViewModel.props Properties
 *
 * @description A `<print-widget />` component's ViewModel
 */
export const ViewModel = widgetModel.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * @property {String} components/print-widget.ViewModel.mapTitle mapTitle
     * @parent components/print-widget.ViewModel.props
     * The ol-map node selector
     */
    mapNode: {
      type: 'string'
    },
    /**
     * @property {String} components/print-widget.ViewModel.mapTitle mapTitle
     * @parent components/print-widget.ViewModel.props
     *
     * The default map title to send to the print service.
     */
    mapTitle: {
      type: 'string',
      value: 'Map Print'
    },
    /**
     * The default layout to select from the print widget
     * @property {String}  components/print-widget.ViewModel.selectedLayout selectedLayout
     * @parent components/print-widget.ViewModel.props
     */
    selectedLayout: {
      type: 'string',
      value: null
    },
    /**
     * The default dpi to select from the print widget
     * @property {Number}  components/print-widget.ViewModel.selectedDpi selectedDpi
     * @parent components/print-widget.ViewModel.props
     */
    selectedDpi: {
      type: 'number',
      value: null
    },
    /**
     * The current list of print results in the widget
     * @property {Array<guides.types.PrintResult>} components/print-widget.ViewModel.printResults printResults
     * @parent components/print-widget.ViewModel.props
     */
    printResults: {
      value: []
    },
    /**
     * The print provider to use for printing
     * @property {providers.printProvider} components/print-widget.ViewModel.provider provider
     * @parent components/print-widget.ViewModel.props
     */
    provider: {
      value: null
    }
  },
  /**
   * Initializes the map property and calls `loadCapabilities` on the provider
   * @signature
   * @param  {can.Map} mapViewModel The ol-map view model
   */
  initMap: function(mapViewModel) {
    var self = this;
    mapViewModel.ready().then(function(map) {
      self.attr('map', map);
      self.attr('provider').loadCapabilities()
        .then(self.handlePrintInfo.bind(self));
    });
  },
  /**
   * Called when the provider resolves the `loadCapabilities` deferred to handle the refresh of the select inputs
   */
  handlePrintInfo: function() {
    can.$('.print-widget select').trigger('change');
  },
  /**
   * Called when the print button is clicked to activate the provider's `print` method.
   */
  printButtonClick: function() {
    if (this.attr('provider') && !this.attr('printing')) {
      this.attr('printing', true);
      this.attr('provider').print({
        map: this.attr('map'),
        layout: this.attr('selectedLayout'),
        dpi: this.attr('selectedDpi'),
        title: this.attr('mapTitle')
      }).then(this.handlePrintout.bind(this));
    }
  },
  /**
   * Click handler for when the clear button is clicked. Empties out the current list of `printResults`
   * @return {[type]} [description]
   */
  clearButtonClick: function() {
    this.attr('printResults').replace([]);
  },
  /**
   * Hanlder for when the print deferred returned by the provider resolves to update add the print result to the list of results
   * @param  {PrintResult} results The result of the printout
   */
  handlePrintout: function(results) {
    this.attr('printing', false);
    this.attr('printResults').push(results);
  }
});

export default Component.extend({
  tag: 'print-widget',
  viewModel: ViewModel,
  template: template,
  events: {
    inserted: function() {
      var mapViewModel = can.$(this.viewModel.attr('mapNode')).viewModel();
      this.viewModel.initMap(mapViewModel);
    }
  }
});
