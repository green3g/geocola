<!--

@module ol-popup
@parent Home.components
@group ol-popup.props Properties
@group ol-popup.events Events

-->

# Description
 A basic openlayers popup to use for displaying content and other components. This popup component registers a click handler in an ol-map component and when activated, it centers itself on the coordinates clicked.

# Usage
 Place inside an `ol-map` component object

```html
 <ol-map default-click="popup" id="main-map" {map-options}="mapOptions">
   <ol-popup id="identify-popup">
    <!-- content -->
   </ol-popup>
 </ol-map>
```
