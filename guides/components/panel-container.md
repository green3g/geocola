# panel-container
## Description:
A panel container. Works with [tab-container](tab-container.md) components or as a standalone collapsible panel.

## Usage:

```html
  <tab-container>
    <panel-container attributes="...">
      <div>content in this panel</div>
    </panel-container>
    <!--additional panels -->
  </tab-container>
```

### Attributes

Attribute     | Type      | Default | Description
------------- | --------- | ------- | --------------------------------------------------------
`title`       | `String`  | `null`  | The title of this panel to display in the tab
`heading`     | `String`  | `null`  | The heading of this panel to display in collapsible mode
`collapsible` | `boolean` | `false` | Allow this panel to collapse when the heading is clicked
`open`        | `Boolean` | `true`  | Set the default state of the panel (if collapsible)
