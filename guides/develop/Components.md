<!--
@page start.developing.components Components
@parent start.developing
-->

Web components are custom elements that quickly enable functionality in an application by providing complex widgets through basic html code. Web components are provided by the CanJS library.

## Example
A basic web component may consist of a tab container, and configuring it is as simple as:

```html
<tab-container>
    <panel-container title="Panel 1" open="true">
        <p>I'm inside panel 1</p>
    </panel-container>
    <panel-container title="Panel 2" open="true">
        <p>I'm inside panel 2</p>
    </panel-container>
</tab-container>
```

## Configuring
Parameters can be passed to components to configure them according to your needs. In the example above, parameters `title` and `open` are passed. The view model automatically converts `open` to a boolean.

Parameter names sometimes contain dashes. These parameter names are translated on the view model since dashes are not acceptable variable names. For example, `paramter-name` will become `parameterName`.

Some components accept objects as parameters. Generally, the syntax for passing an object is `{view-model-parameter}="objectName"` This particular example would pass the object `objectName` to the view model property `viewModelParameter` More information can be found on the [can/view/bindings](http://canjs.com/docs/can.view.bindings.html)

## Component Interaction
Components and the app can interract with each other, and get values from each other's view models. For example, the app may want to store a value from another.

`var title = can.$('panel-container').viewModel().attr('title');`

or more useful

```javascript
//get the panel viewmodel
var panel = can.$('panel-container[title="Panel 1"]').viewModel();

//activate it with the tab container's viewmodel
can.$('tab-container').viewModel().activate(panel);
```
