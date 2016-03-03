# ol-popup

## Usage
Place inside an `ol-map` component object

```html
<ol-map>
  <ol-popup>
    <p>My content</p>
    <my-component option="..."></my-component>
  </ol-popup>
</ol-map>
```

## Description
A basic openlayers popup to use for displaying content.

## View Model Properties

Property | Type      | Default | Description
-------- | --------- | ------- | --------------------------------------------------------------------------------
`modal`  | `boolean` | `false` | Display content inside a bootstrap modal instead of a openlayers overlay element

## Events Emitted

Event  | Data        | Description
------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------
`show` | `ShowEvent` | Fired when the popup is shown with the coordinates that it was shown at. Includes an event object, and the x,y coordinate array at which the popup was shown.
`hide` | `HideEvent` | Fired when the popup is closed or hidden.

## View Model Methods
