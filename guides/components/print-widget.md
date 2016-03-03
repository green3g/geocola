# print-widget
## Description
A basic print widget that allows the user to print to a mapfish server by selecting an available layout, dpi, and title.

Layout, DPI, and all printout formatting is done through customizing the mapfish YAML file.

## Usage

```html
<print-widget map-node="#ol-map-id" print-url="/geoserver/pdf" />
```

## View Model Properties

Property | Type                            | Default | Description
-------- | ------------------------------- | ------- | -----------
map-node | String                          | `null`  | The selector of the ol-map to use for measuring.
provider | `providers/print/PrintProvider` | `null`  | Provider for print services
**Optional** | | |
map-title | String | 'Map Print' | Default map print title
