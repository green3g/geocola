# query-table
## Usage:

```html
<query-table {object-model}="myModal" {fields}="myFieldsArray" />
```

## Description:
A simple query table component that displays a query in a table.

## View Model Properties

Property       | Type           | Default     | Description
-------------- | -------------- | ----------- | -------------------------
`object-model` | `can.Model`    | `null`      | The model object to use to query and update
**Optional**   |                |             |
`fields`       | `String[]`     | `undefined` | An array of fields to display. Any fields not in this array will not be included. All fields included by default
`editable`     | `boolean`      | `false`     | Whether or not to enable editing on this model
**Read-only**  |                |             |
`isLoading`    | `boolean`      | `null`      | Current loading state of the widget
`deferred`     | `can.Deferred` | `null`      | Deferred representing currently pending operations
`objects`      | `boolean`      | `null`      | The list of current objects in the model
`edit_object`  | `can.Map`      | `null`      | The current object being edited

## View Model Methods

Method                                          | Returns     | Description
----------------------------------------------- | ----------- | ---------
`filterData(Object[] objects, String[] fields)` | `Object[]`  | Removes properties not in the list of fields and returns a new array
`editObject(Object objects)`                    | `undefined` | Sets the active `edit_object` property and shows a dialog
`formSubmit(can.Map scope, DomNode form)`       | `false`     | Modifies and saves the edit_object with the submitted form data
`createObject()`                                | `undefined` | Creates a new object and calls `editObject`
`deleteObject()`                                | `false`     | Removes object by calling the objects `destroy` method
