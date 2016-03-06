/*jslint esnext: true */
import can from 'can';
import template from './print.stache!';
import widgetModel from 'components/widget-model';
/**
 * @module print-widget
 * @parent components
 * @body

## Description
 A basic print widget ui that interracts with a print provider, such as the `providers/print/MapfishPrint`

 ## Usage

 ```html
 <print-widget map-node="#ol-map-id" {provider}="instanciatedProvider" />
 ```
 */
export const ViewModel = widgetModel.extend({
  define: {
    /**
     * [mapNode description]
     * @signature
     * @property {String} mapNode
     */
    mapNode: {
      type: 'string'
    },
    /**
     * [mapTitle description]
     * @property {Object}
     */
    mapTitle: {
      type: 'string',
      value: 'Map Print'
    },
    /**
     * [selectedLayout description]
     * @property {Object}
     */
    selectedLayout: {
      type: 'string',
      value: null
    },
    /**
     * [selectedDpi description]
     * @property {Object}
     */
    selectedDpi: {
      type: 'number',
      value: null
    },
    /**
     * [printResults description]
     * @property {Object}
     */
    printResults: {
      value: []
    },
    /**
     * [provider description]
     * @property {Object}
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
