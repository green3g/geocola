<!--

@page start.configure.viewer Viewer App
@parent start.configure
@outline 2

-->

The viewer app utilizes several mapping components to build a complete mapping application. It features:

 * Openlayers map with identify popup
 * Address geocoding with Esri's public geocoder
 * Measuring distances and areas
 * Layer control with legend for WMS layers
 * Printing using a mapfish or other print service

# Demo

@demo index-dev.html?app=app/viewer&config=default/default 800

# Configuring the viewer app

The viewer app accepts the following properties in it's config object.

```javascript
export var config = {
  mapOptions: mapOptions,
  layerProperties: identify,
  locationProvider: locationProvider,
  printProvider: printProvider
};
```

## mapOptions

The `ol-map` options. This object is document by the [MapOptions type](geocola.types.MapOptions)

## layerProperties

Layer properties define how each layer should be displayed when results are identified.

This object is extensively documented in the [Layer Properties type](geocola.types.LayerPropertiesObject)

## locationProvider

Location providers interact with a service api to provide geocoding and feature locating services to the application. Location providers accept their own parameters and are documented in the [providers/location/LocationProvider] page

```javascript
import EsriProvider from 'providers/location/EsriGeocoder';

export let printProvider = new MapfishProvider({
  url: '/proxy/geoserver/pdf',
  method: 'POST'
});
export let locationProvider = new EsriProvider({
  url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/'
});
```

## printProvider

Like location providers, print providers provide extra services for the application. In this case, map exports in the form of files like pdf's or png files. Print providers are documented in the [providers/print/printProvider] page.

```javascript
import MapfishProvider from 'providers/print/MapfishPrint';

export let printProvider = new MapfishProvider({
  url: '/proxy/geoserver/pdf',
  method: 'POST'
});
```
