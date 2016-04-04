/*jslint esnext: true */
import can from 'can';
import template from './print.stache!';
import widgetModel from 'components/widget-model';
/**
 * @module print-widget
 */
export const ViewModel = widgetModel.extend({
  define: {
    /**
     * The ol-map node selector
     * @property {String} print-widget.props.mapNode
     * @parent print-widget.props
     */
    mapNode: {
      type: 'string'
    },
    /**
     * The default map title to send to the print service.
     * @property {String} print-widget.props.mapTitle
     * @parent print-widget.props
     */
    mapTitle: {
      type: 'string',
      value: 'Map Print'
    },
    /**
     * The default layout to select from the print widget
     * @property {String} print-widget.props.selectedLayout
     * @parent print-widget.props
     */
    selectedLayout: {
      type: 'string',
      value: null
    },
    /**
     * The default dpi to select from the print widget
     * @property {Number} print-widget.props.selectedDpi
     * @parent print-widget.props
     */
    selectedDpi: {
      type: 'number',
      value: null
    },
    /**
     * The current list of print results in the widget
     * @property {Array} print-widget.props.printResults
     * @parent print-widget.props
     */
    printResults: {
      value: []
    },
    /**
     * The print provider to use for printing
     * @property {providers.printProvider} print-widget.props.provider
     * @parent print-widget.props
     */
    provider: {
      value: null
    }
  },
  /**
   * @prototype
   */
  /**
   * [function description]
   * @param  {[type]} mapViewModel [description]
   * @return {[type]}              [description]
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
   * [function description]
   * @return {[type]} [description]
   */
  handlePrintInfo: function() {
    can.$('.print-widget select').trigger('change');
  },
  /**
   * [function description]
   * @return {[type]} [description]
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
   * [function description]
   * @return {[type]} [description]
   */
  clearButtonClick: function() {
    this.attr('printResults').replace([]);
  },
  /**
   * [function description]
   * @param  {[type]} results [description]
   * @return {[type]}         [description]
   */
  handlePrintout: function(results) {
    this.attr('printing', false);
    this.attr('printResults').push(results);
  }
});

export default can.Component.extend({
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
