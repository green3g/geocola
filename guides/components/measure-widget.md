#measure-widget

##Description:

A measurement toolbar that adds interaction and vectors/overlays to the map.

##Usage:

```html
<measurement-widget map-node="#ol-map-id" />
```

###options

Attribute        | Type   | Default | Description
---------------- | ------ | ------- | -----------
map-node      | String | `null`  | The selector of the ol-map to use for measuring.
click-handler | String | 'measure' | (Optional) The name of the click handler to use.

###Properties

Property        | Type   | Default | Description
---------------- | ------ | ------- | ---------------------------------------------------
measurements | MeasurementObject[] | `./modules/measurements.js` | The measurement types and units to use for this widget
units-dropdown | String | '' | The current value of the dropdown
