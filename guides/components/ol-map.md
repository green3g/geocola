ol-map
--------

## Description:
A openlayers map component that provides a wrapper for `ol.Map` along with additional functionality. This ol-map component provides a centralized map click handler so that different widgets may activate and deactivate their map click event. Several cola widgets use and require a reference to an ol-map component via a map-node attribute. 

## Usage:

```html
<ol-map attribute="...">
  <child-components />
</ol-map>`
```

### Attributes

Attribute     | Type                                                                  | Default                   | Description
------------- | --------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
projection    | String                                                                | `'EPSG:3857'`             | An openlayers projection code
x             | Number                                                                | 0                         | The starting x-coordinate
y             | Number                                                                | 0                         | The starting y-coordinate
z             | Number                                                                | 1                         | The starting zoom level
default-click | String                                                                | first click handler added | A name of a map click key added by a widget. For example, the measure-widget's click key is 'measure'. If this value is not provided, the default will be the first widget loaded that adds a click handler.
map-options   | [ol map options](http://openlayers.org/en/v3.10.1/apidoc/ol.Map.html) | Defaults                  | (optional) An object with options to initialize the map. Can be used for complex map configurations not supported by simple attributes.

### View Model Methods

Property     | Type                                                                  | Default                   | Description
------------- | --------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ready | promise | | A promise that is resolved with the map when it is ready.
getMap | function | | A getter for the `ol.Map` object.


#### Using complex map options
When the template is rendered using `can.view('<ol-map....', ...)` map options can be supplied in a variety of ways. For complex configuration that might use custom controls or advanced settings not provided by this wrapper, a setup similar to the example below may be used. This example uses  [`can.view.bindings`](http://canjs.com/docs/can.view.bindings.html).

```html
<!--app-template.stache-->
<ol-map id="main-map" {map-options}="mapOptions">
<!-- ... -->
</ol-map>
```

```javascript
//app.js
//Note: target is automatically supplied by the component
import template from './app-template.stache!';
import ol from 'openlayers';

$('#app').html(can.view(template, {
  mapOptions: {
    layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: [10, 30],
        zoom: 13
      })
    }
}));
```
