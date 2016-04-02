<!--

@module {can.Component} list-table
@parent Home.components
@group list-table.types 0 Types
@group list-table.props 2 Properties

-->

## Description
A configureable table that displays rows of data.

The widget is configureable to allow for custom functionality. A `buttons` property provides this capability. When the button is clicked, the eventName is dispatched. In this way, it can be configured to emit any event and display a button with any icon.

## Usage

```html
  <!-- template.stache -->
  <list-table (edit)="editRow" {objects}="objects"
   {buttons}="myButtons" />
```

```javascript
import template from './template.stache!';

can.$('body').append(can.view(template, {
  objects: [{
    prop1: 'val',
    prop2: 'value'
  },{
    prop1: 'something',
    prop2: 'else'
  },{
    prop1: 'more',
    prop2: 'data'
  }],
  myButtons: [{
    iconClass: 'fa fa-trash',
    eventName: 'delete',
    title: 'Remove Row'
  }]
}));
