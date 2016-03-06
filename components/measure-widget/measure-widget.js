/*jshint esnext: true */

import can from 'can';
import ol from 'openlayers';
import template from './measure.stache!';
import './measure.css!';
import measurements from './modules/measurements';
import overlayManager from './modules/overlayManager';
/**
 * @module measure-widget
 * @parent components
 * @body

 ## Description:

 A measurement toolbar that adds interaction and vectors/overlays to the map.

 ## Usage:

 ```html
 <measurement-widget map-node="#ol-map-id" />
 ```

 <img src="images/measure-widget.png" />

 */
export const ViewModel = can.Map.extend({
  define: {
    /**
     * The selector to the `ol-map` component
     * @signature `{String}` `map-node="#map"`
     * @property {String} mapNode
     */
    mapNode: {
      type: 'string'
    },
    /**
     * [clickHandler description]
     * @property {Object}
     */
    clickHandler: {
      type: 'string',
      value: 'measure'
    },
    /**
     * [measurements description]
     * @property {Object}
     */
    measurements: {
      value: measurements
    },
    /**
     * [unitsDropdown description]
     * @property {Object}
     */
    unitsDropdown: {
      value: '',
      type: 'string'
    },
    /**
     * [addLabels description]
     * @property {Object}
     */
    addLabels: {
      value: true,
      type: 'boolean'
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
    this.attr('mapWidget', mapViewModel);
    this.registerClickHandler(mapViewModel);
    mapViewModel.ready().then(this.createOverlayManager.bind(this));
  },
  registerClickHandler: function(mapWidget) {
    //measure widget provides click through ol.interaction class,
    //but we still need to disable the default map click
    mapWidget.addClickHandler(this.attr('clickHandler'), function() { /*noop*/ });
  },
/**
 * [function description]
 * @param  {measureTool} measureTool The measure tool object to activate
 * @return {[type]}             [description]
 */
  activateMeasureTool: function(measureTool) {
    //toggle the button
    measureTool.attr('active', !measureTool.attr('active'));
    if (measureTool.attr('active')) {
      //unselect other buttons
      this.measurements.each(function(measure) {
        if (measure.attr('type') !== measureTool.attr('type')) {
          measure.attr('active', false);
        }
      });
      this.attr('mapWidget').setCurrentClickHandler(this.attr('clickHandler'));
      this.attr('overlayManager').activate(measureTool);
      //can.$('.unitsDropdown').trigger('change');
      this.attr('unitsDropdown', measureTool.attr('units')[0].attr('value'));
      this.attr('overlayManager').changeUnits(this.attr('unitsDropdown'));
    } else {
      this.deactivateMeasureTool();
    }
  },
  deactivateMeasureTool: function() {
    this.attr('overlayManager').deactivate();
    this.attr('mapWidget').setDefaultClickHandler();
  },
  createOverlayManager: function(map) {
    this.attr('overlayManager', new overlayManager({
      map: map,
      addLabels: this.attr('addLabels')
    }));
  },
  clearMeasurements: function() {
    this.attr('overlayManager').clearMeasureOverlays();
  },
  changeUnits: function() {
    this.attr('overlayManager').changeUnits(this.attr('unitsDropdown'));
  },
  toggleLabels: function() {
    this.attr('overlayManager.addLabels', !this.attr('overlayManager.addLabels'));
  }
});

export default can.Component.extend({
  tag: 'measure-widget',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      var mapViewModel = can.$(this.viewModel.attr('mapNode')).viewModel();
      this.viewModel.initMap(mapViewModel);
    }
  }
});
