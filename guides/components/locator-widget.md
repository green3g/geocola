# locator-widget
## Description
A widget for getting and displaying suggestions and address locations from a geocoder provider. Optionally navigates and displays locations to an `ol-map` component.

## Usage

```html
<locator-widget {provider}="providerKeyName" map-node="#map" />
```

## View Model Properties

Property     | Type           | Default | Description
------------- | -------------- | ------- | -----------------
map-node      | String         | `null`  | The selector of the ol-map to add point and zoom to.
**Optional**  |                |         |
address-value | String         | `null`  | The default value of the the search string
zoom-level    | Number         | 18      | The zoom level to apply to the map on address locates.
navigate      | boolean        | true    | Whether or not to navigate the map when address is found
**Read-only** |                |         |
suggestions   | String[]       | `[]`    | The current suggestions in the list
location      | LocationObject | `null`  | The result of the geocode once selected.

## View Model Events

Event               | Data             | Description
------------------- | ---------------- | -----------------------
`location-found`    | `LocationObject` | Fired when a location is geocoded by the provider
`suggestions-found` | `String[]`       | Fired when a suggestions are retrieved by the provider

## LocationObject Properties

Property | Type   | Default | Description
-------- | ------ | ------- | ---------------------------------------
location | String |         | The location name used to geocode.
x        | Float  |         | The longitude or x value of the result.
y        | Float  |         | The latitude or y value of the result.

## View Model Method

Method                                        | Returns     | Description
----------------------------------------------- | ----------- | ---------
`initMap(olMap mapViewModel)`                   | `undefined` | Binds to the `ol-map` ready deferred
`onMapReady(olMap mapViewModel)`                | `undefined` | Stores a reference to the `ol-map` view model
`searchAddressValue(string address)`            | `undefined` | Searches the provider for new suggestions and updates accordingly
`selectAddress(string address)`                 | `undefined` | Triggers the provider to geocode a qualified address and calls `handleAddressLocated`
`clearSuggestions()`                            | `undefined` | Clears the current suggestions list
`clearGraphics()`                               | `undefined` | Clears any graphics on the map and temporarily removes the layer
`handleAddressLocated(LocationObject location)` | `undefined` | Dispatches `location-found` event with the location object and calls `navigateMap`
`navigateMap(LocationObject location)`          | `undefined` | Pans and zooms the map

## Providers
Providers are the abstraction between this widget and different geocoders. Providers implement different functions that return results the widget can handle.

### esriGeocoderProvider
