/*jshint esnext: true */
import can from 'can';

import template from './olPopup.stache!';
import './olPopup.css!';
import widgetModel from 'components/widget-model';

/**
 * @module ol-popup
 * @parent Home.components
 * @body
 ## Description
 A basic openlayers popup to use for displaying content.

 ## Usage
 Place inside an `ol-map` component object

 ```html
 <ol-map>
   <ol-popup>
     <p>My content</p>
     <my-component option="..."></my-component>
   </ol-popup>
 </ol-map>
 ```
 *
 */
export const ViewModel = widgetModel.extend({
  define: {
    modal: {
      type: 'boolean',
      value: false
    }
  },
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
   * hides this popup
   */
  hidePopup: function() {
    this.attr('overlay').setPosition(undefined);
    can.$('#modal-' + this.attr('instanceId')).modal('hide');
    this.dispatch('hide', [this]);
  },
  /**
   * shows this popup
   * @param  {[type]} coordinate [description]
   * @return {[type]}            [description]
   */
  showPopup: function(coordinate) {
    if (this.attr('modal')) {
      can.$('#modal-' + this.attr('instanceId')).modal('show');
    } else {
      this.centerPopup(coordinate);
    }
    this.dispatch('show', [coordinate]);
  },
  centerPopup: function(coordinate) {
    if (!this.attr('modal')) {
      this.attr('overlay').setPosition(coordinate);
    } else {
      this.attr('map').getView().setCenter(coordinate);
    }
  },
  /*
   * the function when the map is clicked
   * should return a function to perform
   * this is meant to be overridden
   */
  onMapClick: function(event) {
    this.showPopup(event.coordinate);
  }
});

export default can.Component.extend({
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
