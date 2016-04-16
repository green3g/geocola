<!--

@module {can.Map} MapfishPrint
@parent printProvider.providers
@group MapfishPrint.props Properties
@link http://docs.geoserver.org/latest/en/user/extensions/printing/index.html Geoserver Extension
@link http://www.mapfish.org/doc/print/ Mapfish Print Server

-->

# Mapfish print service provider

Provides access to mapfish print services from the `print-widget` component

This provider has been tested with the geoserver mapfish plugin, and should also work with the mapfish server.

## Usage
```javascript
import Provider from 'providers/print/MapfishPrint';
var provider = new Provider({
 url: 'path/to/mapfish/pdf/',
 //other options
});
```

## Layers supported

- OSM
- Vector
- TileWMS
- ImageWMS
