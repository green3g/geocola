<!--

@module {can.Component} components/filter-widget <filter-widget />
@parent geocola.components
@group filter-widget.props Properties
@link http://jsonapi.org/format/#fetching-filtering JSON-API

-->

## Description

A widget with several fields that let the user filter a rest response. Uses a list-table to display the current filter objects.

The filters generated follow the JSON API specification implemented by Flask-Restless

## Usage

  ```javascript
  import 'components/filter-widget/viewModel';
  ```
```html
  <filter-widget />
  ```

## Demo

@demo components/filter-widget/demo.html 500
