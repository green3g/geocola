import can from 'can/util/library';
import List from 'can/list/';
import CanMap from 'can/map/';
import 'can/map/define/';
import Component from 'can/component/';
import ol from 'openlayers';
import template from './measure.stache!';
import './measure.css!';
import measurements from './modules/measurements';
import overlayManager from './modules/overlayManager';

/**
 * @constructor components/measure-widget.ViewModel ViewModel
 * @parent components/measure-widget
 * @group components/measure-widget.ViewModel.props Properties
 *
 * @description A `<measure-widget />` component's ViewModel
 */
export const ViewModel = CanMap.extend({
  define: {
    /**
     * The selector to the `ol-map` component
     * @signature `{String}` `map-node="#map"`
     * @property {String} components/measure-widget.ViewModel.props.mapNode
     * @parent components/measure-widget.ViewModel.props
     */
    mapNode: {
      type: 'string'
    },
    /**
     * The name of the click handler key to use. The default is `'measure'`.
     * @property {String} components/measure-widget.ViewModel.props.clickHandler
     * @parent components/measure-widget.ViewModel.props
     */
    clickHandler: {
      type: 'string',
      value: 'measure'
    },
    /**
     * An array of measurement objects to use. These are configureable in `./modules/measurements`
     * @property {Array<measurementObjects>} components/measure-widget.ViewModel.props.measurements
     * @parent components/measure-widget.ViewModel.props
     */
    measurements: {
      value: measurements
    },
    /**
     * The current value in the units dropdown
     * @property {String} components/measure-widget.ViewModel.props.unitsDropdown
     * @parent components/measure-widget.ViewModel.props
     */
    unitsDropdown: {
      value: '',
      type: 'string'
    },
    /**
     * Should labels be added to the map drawings by default
     * @property {Boolean} components/measure-widget.ViewModel.props.addLabels
     * @parent components/measure-widget.ViewModel.props
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
   * Calls widget initialization functions
   * @signature
   * @param  {can.Map} mapViewModel The ol-map view model
   */
  initMap: function(mapViewModel) {
    this.attr('mapWidget', mapViewModel);
    this.registerClickHandler(mapViewModel);
    mapViewModel.ready().then(this.createOverlayManager.bind(this));
  },
  /**
   * Registers the map click handler with the property `clickHandler`. Since this widget uses ol.interaction an empty click handler is assigned
   * @signature
   * @param  {can.Map} mapWidget The ol-map view model
   */
  registerClickHandler: function(mapWidget) {
    //measure widget provides click through ol.interaction class,
    //but we still need to disable the default map click
    mapWidget.addClickHandler(this.attr('clickHandler'), function() { /*noop*/ });
  },
  /**
   * This is the function called when a tool button is clicked. Activates a measure tool if is not already active. If it is already active, it deactivates the measure tool.
   * @signature
   * @param  {measureToolObject} measureTool The tool to activate
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
      this.attr('unitsDropdown', measureTool.attr('units')[0].attr('value'));
      this.attr('overlayManager').changeUnits(this.attr('unitsDropdown'));
    } else {
      this.deactivateMeasureTool();
    }
  },
  /**
   * Calls methods to deactivate the measure widget
   * @signature
   */
  deactivateMeasureTool: function() {
    this.attr('overlayManager').deactivate();
    this.attr('mapWidget').setDefaultClickHandler();
  },
  /**
   * Initializes the module that handles layer display
   * @signature
   * @param  {ol.map} map The openlayers map
   */
  createOverlayManager: function(map) {
    this.attr('overlayManager', new overlayManager({
      map: map,
      addLabels: this.attr('addLabels')
    }));
  },
  /**
   * Calls methods to clear the overlay layers
   * @signature
   */
  clearMeasurements: function() {
    this.attr('overlayManager').clearMeasureOverlays();
  },
  /**
   * Calls methods to update the units on the overlay layers
   * @signature
   */
  changeUnits: function() {
    this.attr('overlayManager').changeUnits(this.attr('unitsDropdown'));
  },
  /**
   * Calls methods to toggle labels on the overlay layers
   * @signature
   */
  toggleLabels: function() {
    this.attr('overlayManager.addLabels', !this.attr('overlayManager.addLabels'));
  }
});

export default Component.extend({
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
