# tab-container
## Description:
A basic tab container. Works with [panel-container](panel-container.md) components.

## Usage:

```html
  <tab-container></tab-container>
```

## Attributes

Attribute | Type               | Default | Description
--------- | ------------------ | ------- | ------------------
`panels`  | `panelContainer[]` | `[]`    | Array of panel containers in this tab container. These are added via child html components.

## View Model Methods

Method                              | Returns | Description
----------------------------------- | ------- | -------------
`addPanel(panelContainer panel)`    | `this`  | Adds a new panel
`removePanel(panelContainer panel)` | `this`  | Removes a panel
`activate(panelContainer panel)`    | `this`  | Activates an existing panel
