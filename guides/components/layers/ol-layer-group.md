#ol-layer-group

##Description:

Adds a new group layer to the parent map or group layer. Inherits `ol-layer` and layerViewModel.

##Usage:

This component should be placed inside an `ol-map` or `ol-layer-group` component.

```html
<ol-map>
  <ol-layer-group attribute="..." />
</ol-map>

<!-- Or -->
<ol-layer-group>
  <ol-layer-group attribute="..." />
</ol-layer-group>
```

Attribute    | Type      | Default       | Description
-------------| ----------| ------------- | ---------------------------------
`radio-roup` | `boolean` | `false` | If set to true, and the layer control is used, this group will only allow one layer active at a time, and will be displayed in a radio checkbox format.

In addition see [ol-layer](ol-layer) for inherited properties.
