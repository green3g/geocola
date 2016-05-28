import can from 'can/util/library';
import Component from 'can/component/';
import template from './olPopup.stache!';
import './olPopup.css!';
import widgetModel from '../widget-model';

/**
 * @constructor components/ol-popup.ViewModel ViewModel
 * @parent components/ol-popup
 * @group components/ol-popup.ViewModel.props Properties
 *
 * @description A `<ol-popup />` component's ViewModel
 */
export const ViewModel = widgetModel.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Whether or not the current state of this popup should be a modal dialog instead of a map overlay popup. This can be changed dynamically
     * @property {Boolean} components/ol-popup.ViewModel.props.modal
     * @parent components/ol-popup.ViewModel.props
     */
    modal: {
      type: 'boolean',
      value: false
    }
  },
  /**
   * Initializes the widget by adding a map click handler and setting up the ol.overlay
   * @param  {can.Map} mapViewModel   The ol-map view model
   * @param  {domElement} overlayElement The jquery dom element to set up this overlay in
   */
  initWidget: function(mapViewModel, overlayElement) {
    mapViewModel.addClickHandler('popup', this.onMapClick.bind(this));
    var self = this;
    mapViewModel.ready().then(function(map) {
      self.attr('map', map);
      self.attr('overlay', new ol.Overlay({
        element: overlayElement,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      }));
      map.addOverlay(self.attr('overlay'));
    });
  },
  /**
   * @typedef {can.Event} ol-popup.events.popupHide hide
   * An event dispatched when the popup is hidden
   * @parent ol-popup.events
   * @option {can.Map} popupModel The popup view model
   */
  /**
   * Hides this popup and dispatches a `hide` event
   */
  hidePopup: function() {
    this.attr('overlay').setPosition(undefined);
    can.$('#modal-' + this.attr('instanceId')).modal('hide');
    this.dispatch('hide', [this]);
  },
  /**
   * @typedef {can.Event} ol-popup.events.popupShow show
   * An event dispatched when the popup is shown
   * @parent ol-popup.events
   * @option {Array<Number>} coordinate The coordinate in which the popup is shown
   */
  /**
   * Displays and centers this popup on a coordinate, and dispatches the `show` event
   * @param  {Array<Number>} coordinate The x,y pair to center the popup on
   */
  showPopup: function(coordinate) {
    if (this.attr('modal')) {
      can.$('#modal-' + this.attr('instanceId')).modal('show');
    } else {
      this.centerPopup(coordinate);
    }
    this.dispatch('show', [coordinate]);
  },
  /**
   * Centers the popup on a coordinate
   * @param  {Array<Number>} coordinate The coordinate to center on
   */
  centerPopup: function(coordinate) {
    if (!this.attr('modal')) {
      this.attr('overlay').setPosition(coordinate);
    } else {
      this.attr('map').getView().setCenter(coordinate);
    }
  },
  /*
   * the function when the map is clicked
   */
  onMapClick: function(event) {
    this.showPopup(event.coordinate);
  }
});

export default Component.extend({
  tag: 'ol-popup',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      var mapViewModel = this.element.parent().viewModel();
      this.viewModel.initWidget(mapViewModel, this.element.find('.ol-popup')[0]);
    }
  }
});
