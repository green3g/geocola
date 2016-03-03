# ol-layer
## Description
A base component for other ol-layers to extend from. See [ol-layer-tilewms](ol-layer-tilewms.md) to see how this is done.

The component uses the base viewModel of layerViewModel. Other layer types' viewModels can inherit this viewModel.

## Usage

```JavaScript
import baseViewModel from './layerViewModel';
import layer from 'components/ol-layer';

export default layer.extend({
  viewModel: baseViewModel.extend({
    //view model method and property overrides
  }),
  //your component overrides
});
```

## View Model Properties
All layers inheriting from this viewmodel/component inherit the following attributes automatically.

Property           | Type      | Default   | Description
------------------ | --------- | --------- | ------------------------------------------------------------------------------------------
`title`            | `string`  | `'Layer'` | The title of this layer is used by other widgets using `layer.get('title')``
`visible`          | `boolean` | `true`    | The default visibility of this layer.
`type`             | `string`  |           | The name of the ol.layer class. Used by child classes to provide automatic layer creation.
`exclude-identify` | `boolean` | `false`   | Used by the popup widget to exclude entire layers from the identify results.
