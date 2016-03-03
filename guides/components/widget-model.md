#widget-model

##Description

The optional base class for widgets. Provides unique widget id and uses `can.event` for `this.dispatch('eventName', args)` functionality

##Usage

```JavaScript
import model from 'components/widget-model'

export default model.extend({
  //your model overrides
});
```

###Attributes

Attribute | Type   | Default    | Description
--------- | ------ | ---------- | ---------------------------------------------
instance-id | String | widget-xxx | A randomly generated widget-id. Can be overridden by this property
