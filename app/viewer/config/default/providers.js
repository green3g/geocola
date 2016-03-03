/*jshint esnext: true*/

import esriProvider from 'providers/location/EsriGeocoder';
import mapfishProvider from 'providers/print/MapfishPrint';

export let printProvider = new mapfishProvider({
  url: '/proxy/geoserver/pdf',
  method: 'GET'
});
export let locationProvider = new esriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/'
});
