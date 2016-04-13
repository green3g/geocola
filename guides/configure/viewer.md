<!--

@page start.configure.viewer Viewer App
@parent start.configure
@outline 2

-->

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

This is an object similar to the default openlayers map options and can include any of the properties accepted by the map constructor. The required properties are `layers` and `view`.

```javascript
var mapoptions = {
  layers: layers,
  view: view
};
```

### layers

The layers property is an array of objects similar to the default openlayers layer options and can include any properties accepted by the layer constructor. Each layer requires the properties `type` `sourceOptions` and `options`. The only exception is the layer type `group` which does not require the `sourceOptions`.

New layer types can easily be added to the LayerFactory, or the layer object itself can be provided. The layer factory automatically checks to see if the object is an instance of ol.layer before generating a new one.

#### Types

 * `TileWMS`: A tiled wms layer
 * `Group`: A group layer
 * `ImageWMS`: A non-tiled wms layer
 * `OSM`: A generic OSM tiled layer

#### Layer options

In addition to the default openlayers properties, some widgets also use custom options not defined by openlayers.

  * `visible`: The default visibility of the layer
  * `title`: The title of the layer. Used to display the layer name to the user
  * `excludeIdentify`: Excludes this entire resource from the identify widget
  * `excludeControl`: Excludes this layer from the layer controller widget
  * `id`: A unique layer id (optional)

#### TileWMS Source Options

 * `type`: `TileWMS`
 * `url`: The web address to the wms resource
 * `params`: An object with key value pairs to send in the WMS request. The only required parameter for most wms servers is `LAYERS`.

#### Group Layer Options

 * `type`: `Group`
 * `layers`: An array of layer objects

#### ImageWMS Source Options

See TileWMS Source options

#### OSM Source Options

See openlayers api

### view

The view object is essentially an object with parameters that will be passed to an openlayers view. It mainly consists of the information that sets up how the map will look and where it will start.

```javascript
var view = {
  zoom: 4,
  projection: 'EPSG:3857',
  center: [-10381543.579497037, 4510420.927406358]
};
```

## layerProperties

Layer properties define how each layer should be displayed when results are identified.

This object is extensively documented in the [geocola.types.LayerPropertiesObject]

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
