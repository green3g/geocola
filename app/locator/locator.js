/*jshint esnext: true */
import can from 'can';
import ol from 'openlayers';
import 'components/locator-widget/';
import 'components/modal-container/';
import 'components/ol-map/';
import 'components/tab-container/';
import 'bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css!';
import '../../node_modules/font-awesome/css/font-awesome.min.css!';
import 'node_modules/openlayers/dist/ol.css!';
import './locator_app.css!';

import template from './locator_app.stache!';

import esriProvider from 'providers/location/EsriGeocoder';
var locationProvider = new esriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
  searchPoint: [-93.29083588456768,
    44.32815650851717
  ]
});

export let AppViewModel = can.Map.extend({
  define: {
    address: {
      Value: can.Map
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
          }),
          new ol.layer.Image({
            maxResolution: 2,
            source: new ol.source.ImageWMS({
              url: 'http://104.254.109.118:8080/cgi-bin/mapserv.exe?map=%2Fms4w%2Fapps%2Fgeomoose2%2Fmaps%2F%2Ffaribault%2Fcadastral%2Fparcels.map',
              params: {
                LAYERS: 'parcels',
                SRS: 'EPSG:3857'
              }
            })
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
    can.route(':location/:x/:y');
    can.route.ready();
    can.route.bind('change', this.routeChange.bind(this));
    this.attr('address', can.route.attr());

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
    can.route.attr(results, true);
    this.attr('address', results);
    can.$('title').text(this.attr('address.location'));
  },
  routeChange: function() {
    this.attr('address', can.route.attr());
    can.$('title').text(this.attr('address.location'));
  },
  handleSuggestions: function() {
    self.attr('address', null);
  }
});
