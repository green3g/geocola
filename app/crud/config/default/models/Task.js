import { FlaskConnectFactory } from 'can-crud/providers/api/FlaskModelFactory';
import CanMap from 'can/map/';
//define plugin
//https://canjs.com/docs/can.Map.prototype.define.html
import 'can/map/define/';

//import fake ajax services
import 'can-crud/test/data/fixtures';

//instance of supermap
export let TaskInfo = FlaskConnectFactory({
  url: '/tasks',
  name: 'task',
  map: CanMap.extend({
    define: {
      id: {
        type: 'number',
        value: 0
      },
      name: {
        type: 'string',
        value: 'Clean dishes'
      },
      description: {
        type: 'string',
        value: ''
      },
      complete: {
        type: 'boolean',
        value: false
      },
      date_complete: {
        type: 'date',
        //capital Value means call the constructor in canjs
        //https://canjs.com/docs/can.Map.prototype.define.ValueConstructor.html
        Value: Date
      }
    }
  })
});

export let TaskFields = ['id', 'name', {
  name: 'description',
  excludeListTable: true
}, 'complete', {
  name: 'date_complete',
  excludeListTable: true,
  type: 'date'
}];
