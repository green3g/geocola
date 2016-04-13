<!--

@module {can.Component} components/form-widget <form-widget />
@parent geocola.components
@group form-widget.fields 1 Field Types

-->

## Description
A configureable form widget to modify data. The form accepts a formObject property that should be an object similar to a `can.Map`. When the form is submitted, it calls the model's `save` method.

## Usage
```html
  <!-- template.stache -->
  <form-widget {form-object}="formObject" />
```

## Demo

@demo components/form-widget/demo.html 500
