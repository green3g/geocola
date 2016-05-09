import can from 'can/util/';
import Route from 'can/route/';
import CanMap from 'can/map/';
import ol from 'openlayers';
import 'components/locator-widget/';
import 'components/modal-container/';
import 'components/ol-map/';
import 'components/tab-container/';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap/dist/css/bootstrap-theme.min.css!';
import 'font-awesome/css/font-awesome.min.css!';
import 'openlayers/dist/ol.css!';
import './locator_app.css!';

import template from './locator_app.stache!';

import esriProvider from 'providers/location/EsriGeocoder';
var locationProvider = new esriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
  searchPoint: [-93.29083588456768,
    44.32815650851717
  ]
});

export let AppViewModel = CanMap.extend({
  define: {
    address: {
      Value: CanMap
    },
    apikey: {
      value: 'AIzaSyC_WpfGhW9h6HikAqOE9d8148hNG55gjTs'
    },
    origin: {
      value: '208 1st Ave NW, Faribault, MN 55021'
    },
    mapOptions: {
      type: '*',
      value: {
        layers: new ol.Collection([
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ])
      }
    }
  },
  startup: function() {
    this.attr('locationProvider', locationProvider);

    //render the template
    $('#app').html(can.view(template, this));

    //on location found update the app content
    can.viewModel('#locator').on('location-found', this.handleLocation.bind(this));

    //on suggestions found reset the app content
    can.viewModel('#locator').on('suggestions-found ', this.handleSuggestions.bind(this));

    //set up routing
    Route(':location/:x/:y');
    Route.ready();
    Route.bind('change', this.routeChange.bind(this));
    this.attr('address', Route.attr());

    //fix an issue with map stretching when steal builds the app
    setTimeout(function() {
      var maps = can.$('ol-map');
      maps.each(function(index, node) {
        var viewModel = can.$(node).viewModel();
        viewModel.attr('mapObject').updateSize();
      });
    }, 500);
  },
  handleLocation: function(event, results) {
    Route.attr(results, true);
    this.attr('address', results);
    can.$('title').text(this.attr('address.location'));
  },
  routeChange: function() {
    this.attr('address', Route.attr());
    can.$('title').text(this.attr('address.location'));
  },
  handleSuggestions: function() {
    self.attr('address', null);
  }
});
