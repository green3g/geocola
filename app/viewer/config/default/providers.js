/*jshint esnext: true*/

import EsriProvider from 'can-geo/providers/location/EsriGeocoder';
import MapfishProvider from 'can-geo/providers/print/MapfishPrint';

export let printProvider = new MapfishProvider({
  url: '/proxy/geoserver/pdf',
  method: 'POST'
});
export let locationProvider = new EsriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/'
});
