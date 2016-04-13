@typedef {Object} geocola.types.ControlLayerObject ControlLayerObject
@parent geocola.types
@option {Boolean} exclude Whether or not to exclude from the layer control
@option {String} title The layer title
@option {Boolean} visible The layers visibility
@option {ol.Layer} layer The openlayers layer
@option {can.stache} template The template to render the layer with. This is an object provided by can.stache a stache template imported by StealJS.

@description Custom objects for rendering layer controls. These objects are built by the layer control when it is initialized and are used by the template to render different types of controls for different layers.
