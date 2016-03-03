# ol-layer-tilewms
## Description
Adds a new tiled wms layer to the parent map or group layer. Inherits `ol-layer` and its view model.

## Usage
This component should be placed inside an `ol-map` or `ol-layer-group` component.

```html
<ol-map>
  <ol-layer-tilewms attribute="..." />
</ol-map>

<!-- Or -->
<ol-layer-group>
  <ol-layer-tilewms attribute="..." />
</ol-layer-group>
```

Attribute | Type     | Default | Description
--------- | -------- | ------- | --------------------------------------------
`url`     | `string` | `null`  | The url to the wms server
`layers`  | `string` | `null`  | A comma delineated list of layers to include

In addition see [ol-layer](ol-layer.md) for inherited properties.
