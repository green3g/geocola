<!--

@module {can.Component} components/identify-widget <identify-widget />
@parent geocola.components
-->

## Description
A configureable feature identify tool for wms layers using wms `GetFeatureInfo` protocol. The wms server must be capable of privoviding json results
- Queries wms layers and displays the results when map is clicked
- Works inside an ol-popup componenet by centering the popup on a feature geometry when a feature is selected
- Support for customizing each field and the entire feature's properties is baked in

## Usage
This component may be placed inside an `ol-popup` component, but it doesn't have to be.
```html
<ol-popup>
  <identify-widget {layer-properties}="propsObj" />
</ol-popup>
```

<img src="static/img/components/identify-widget.png" />
