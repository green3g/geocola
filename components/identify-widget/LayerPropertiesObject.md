@typedef {Object} geocola.types.LayerPropertiesObject LayerPropertiesObject
@parent geocola.types
@option {String} alias The label to display for the layer The default is the layer name as provided by the server
@option {String | can.view.renderer} template The template to render for this layer's popup. This can be a template imported via `import templateName from './templatePath.stache!';` (recommended) or a string template. The default is `components/identify-widget/featureTemplate.stache`
@option {geocola.types.FieldPropertiesObject} properties An object that defines how each property should be displayed.

@description An object consisting of a key mapped to the layer name as returned by the server with its value consisting of properties defining the layer display.

# Example

```javascript
var layerProperties = {
  states: {
    //these first properties control how the layer overall will display
    //in the identify-widget
    alias: 'US States',
    template: statesTemplate,
    fieldProperties: {
      //these properties specify how each field should be displayed
      geometry: {
        exclude: true
      },
      bbox: {
        exclude: true
      },
      STATE_NAME: {
        alias: 'Name',
        formatter: function(name, properties) {
          return [
            'See app/viewer/config/default/identify/identify.js</strong>',
            '<br />',
            'to see how this is done:<br /><strong>',
            name,
            ' is Awesome!</strong>'
          ].join('');
        }
      }
    }
  },
  'GISDATA\.TOWNS_POLYM': {
    alias: 'Cities'
  }
}
```
