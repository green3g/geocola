# identify-widget
## Description
A configureable feature identify tool for wms layers using wms `GetFeatureInfo` protocol. The wms server must be capable of privoviding json results
- Queries wms layers and displays the results when map is clicked
- Works inside an ol-popup componenet by centering the popup on a feature geometry when a feature is selected
- Support for customizing each field and the entire feature's properties is baked in

## Usage
This component may be placed inside an `ol-popup` component, but it doesn't have to be.

```html
<ol-popup>
  <ol-popup-identify {layer-properties}="propsObj" />
</ol-popup>
```

## View Model Properties

Property             | Type       | Default      | Description
-------------------- | ---------- | ------------ | --------------------------------------------------------------------------------------------------------
`map-node`           | `string`   | `undefined`  | The selector for the `ol-map` component
**Optional**         |            |              |
`layer-properties`   | `can.Map`  | `undefined`  | A layer properties object (see [layerProperties Definition](#layerproperties-definition))
`popup-node`         | `string`   | `undefined`  | The selector for the `ol-popup` component. This is necessary if the widget is placed inside an ol-popup.
`max-feature-count`  | `number`   | `10`         | The default max number of features returned per layer
`feature-buffer`     | `number`   | `10`         | The default identify buffer placed around the point where the map was clicked
`map-click-key`      | `string`   | `'identify'` | The key to use for this widget's map click function id
**Read-Only**        |            |              |
`features`           | `can.List` | `[]`         | The current features in this widget
`loading`            | `boolean`  | `false`      | The current loading state
`activeFeature`      | `can.Map`  | `null`       | The active feature in the widget
`activeFeatureIndex` | `number`   | `0`          | The index of the feature that is currently active
`hasNextFeature`     | `boolean`  | `false`      | Whether or not there is a next feature in the list
`hasPreviousFeature` | `boolean`  | `false`      | Whether or not there is a previous feature in the list

## layerProperties Definition
A key/value object where key is the layer name and the object defines how to display the layer. Each layer property object may contain any of the following:

Property          | Type                          | Default                  | Description
----------------- | ----------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`excludeIdentify` | `boolean`                     | `false`                  | Exclude this layer from the identify results
`template`        | `string` or `template object` | `featureTemplate.stache` | Template should be imported using `import template from 'template/path.stache!'` Default is automatically imported from  `components/identify-widget/featureTemplate.stache`
`alias`           | `string`                      |                          | An alternative title to show for the layer title. This will appear as the tab title in the identify popup.
`properties`      | `{fieldProperties object}`    |                          | Key value pairs referencing field names and the field names properties. [See fieldProperties defintions](#fieldproperties-definition)

## fieldProperties Definition

Property    | Type                                       | Default     | Description
----------- | ------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`exclude`   | `boolean`                                  | `undefined` | Set to true to skip this field
`alias`     | `string`                                   |             | An alternative name  to display for the field.
`formatter` | `string function(rawValue, allProperties)` |             | A function that is called to format the field's value. It takes one argument, fieldValue and should return an html string. <br /><br /><b>If it is provided, the value field is not escaped, so this function should return safe html. `can.esc(string)` in `can.util` provides safe html alternatively.</b>

### Sample config

```Javascript
/* jshint esnext: true */
export let layerProperties = {
  //the name (id) of the layer
  states: {
    //an optional alias for the layer. This is displayed in the tab
    alias: 'US States',
    //an optional template path to use for each feature. This will be used
    //as a replacement for the default attribute table
    template: 'app/viewer/identify/states.stache',
    //the properties to configure for this layer
    properties: {
      //the property name from the server
      STATE_NAME: {
        //an override for this property name to display to the user
        alias: 'Name',
        //a function that will format the value of this property
        formatter: function(name){
          return name + ' is Awesome!'
        }
      }
    }
  }
}
```

## Additional Layer Property
Additionally, each wms layer in the map can have an optional parameter passed `excludeIdentify` which will exclude the entire wms layer from the getFeatureInfo queries.
