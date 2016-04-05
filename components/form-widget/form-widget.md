<!--

@module {can.Component} form-widget
@parent Home.components
@group form-widget.types 0 Types
@group form-widget.fields 1 Field Types
@group form-widget.events 3 Events
@group form-widget.props 4 Properties

-->

## Description
A configureable form widget to modify data. The form accepts a formObject property that should be an object similar to a `can.Map`. When the form is submitted, it calls the model's `save` method.

## Usage
```html
  <!-- template.stache -->
  <form-widget {form-object}="formObject" (submit)="resetPage"
   (cancel)="resetPage" {fields}="formFields" />
```

```javascript
//javascript
let Filter = Map.extend({
  name: null,
  op: 'like',
  val: null,
  save: function() {  } //noop to simulate a supermodel
});

//...
fields: {
  value: [{
    name: 'name',
    alias: 'Field name',
    placeholder: 'Enter a field name'
  }, {
    name: 'op',
    alias: 'is',
    placeholder: 'Choose a operator',
    type: 'select',
    properties: {
      options: [{
        label: 'Equal to',
        value: '=='
      }, {
        label: 'Not equal to',
        value: '!='
      }, {
        label: 'Contains',
        value: 'in'
      }, {
        label: 'Does not contain',
        value: 'not_in'
      }, {
        label: 'is like',
        value: 'like'
      }]
    }
  }, {
    name: 'val',
    alias: 'Value',
    placeholder: 'Enter the filter value'
  }]
},
formObject: {value: Filter}
//...
```
