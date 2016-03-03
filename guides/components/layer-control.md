layer-control
--------------

##Description:

A layer controller to handle layer visibility and perform additional layer functions.

##Usage:

```html
<layer-control map-node="#map" />
```

##Attributes

Attribute        | Type   | Default | Description
---------------- | ------ | ------- | -----------
`map-node`      | `String` | `null`  | The selector of the ol-map to control the layers on.
`layers`      | `ol.collection` | `null`  | The collection of layers provided from `ol.map.getLayers`

##View model methods

Method | Returns | Description
-------|---------|------------
`initControl(olMap mapViewModel)` | `undefined` | Initializes the layer control once the map is ready
`addLayers(ol.collection layers)` | `undefined` | Calls `addLayer` for each layer and binds to the add/remove events of the collection
`addLayer(ol.layers.layer layer)` | `undefined` | Adds a layer to the view models collection
`removeLayerById(olMap mapViewModel)` | `undefined` | Removes a layer
`getLayerTemplate(ol.layers.layer layer)` | `undefined` | Returns a template renderer for the layer
