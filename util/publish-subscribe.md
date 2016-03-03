#Publish/subscribe

##Description:

A helper utility that may allow different widgets to share information with other widgets using the publish and subscribe design pattern.

##Usage:

```JavaScript
/*jshint esnext: true */
import pubsub from 'util/pub-sub/pub-sub';

pubsub.subscribe('my/topic', function(e){
  console.log('data was: ' + e.data); //prints "data was: Data!"
});

pubsub.publish('my/topic', {
  data: 'Data!'
});

```
