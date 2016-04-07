<!--

@parent Home.components
@group property-table.types Types
@group property-table.props Properties

-->

## Description
A widget for getting and displaying an objects properties in a tabular two column format.
The first column is mapped to the object property name, which is formatted by removing spaces
and capitalizing the first letter. Additional display options may be provided through the
`field-properties` property.

## Usage

```html
<property-table object-id="3" {connection}="connection"
 {field-properties}="detailFields" />
```
