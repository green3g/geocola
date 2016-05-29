/*jshint esnext: true*/

import EsriProvider from 'geocola-map/providers/location/EsriGeocoder';
import MapfishProvider from 'geocola-map/providers/print/MapfishPrint';

export let printProvider = new MapfishProvider({
  url: '/proxy/geoserver/pdf',
  method: 'POST'
});
export let locationProvider = new EsriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/'
});
