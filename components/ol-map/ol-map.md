<!--

@module {can.Component} components/ol-map <ol-map />
@parent geocola.components

-->

## Description

A openlayers map component that provides a wrapper for `ol.Map` along with additional functionality. This ol-map component provides a centralized map click handler so that different widgets may activate and deactivate their map click event. Several widgets use and require a reference to an ol-map component via a map-node attribute.

## Usage

```html
<ol-map id="main-map" {map-options}="mapOptions">
  <child-components />
</ol-map>`
```


## Demo

@demo components/ol-map/demo.html 500
