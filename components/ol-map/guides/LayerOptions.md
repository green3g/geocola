@typedef {Object} geocola.types.LayerOptions LayerOptions
@parent geocola.types
@option {String} type The openlayers layer class to use as the layer. Currently supported types are:
 - TileWMS
 - Group
 - OSM
 - ImageWMS
@option {Object} sourceOptions The options to pass to the openlayers source. This is specific to the type of openlayers layer source.

@description
The `LayerOptions` object is similar to the default openlayers layer options and can include any properties accepted by the layer constructor. Each layer requires the properties `type` and `sourceOptions`. The only exception is the layer type `group` which does not require the `sourceOptions`. Additional properties are documented by the [openlayers layer base api docs](http://openlayers.org/en/master/apidoc/ol.layer.Base.html)

New layer types can easily be added to the LayerFactory, or the layer object itself can be provided. The layer factory automatically checks to see if the object is an instance of ol.layer before generating a new one.
