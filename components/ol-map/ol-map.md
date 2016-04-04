<!--

@module ol-map
@parent Home.components
@group ol-map.props Properties

-->

## Description

A openlayers map component that provides a wrapper for `ol.Map` along with additional functionality. This ol-map component provides a centralized map click handler so that different widgets may activate and deactivate their map click event. Several widgets use and require a reference to an ol-map component via a map-node attribute.

## Usage

```html
<ol-map id="main-map" {map-options}="mapOptions">
  <child-components />
</ol-map>`
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
