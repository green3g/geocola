import Map from 'can/map/';
import {
  FlaskConnectFactory
} from 'models/FlaskModelFactory';

var TaskConnection = FlaskConnectFactory({
  url: '/api/tasks_task',
  name: 'tasks_task',
  map: Map.extend({
    name: 'test',
    description: 'test',
    yes_or_no: false
  })
});

var Card = FlaskConnectFactory({
  url: '/api/tap_card',
  map: Map.extend({
    "corporation": "3/4\"-230' SE OF SAN MH # 2   PLAN D2428",
    "curb_stop_description": "3/4\"-9' E. OF CURB & ON S. LINE OF GARAGE",
    "date_created": "2001-10-05T00:00:00",
    "date_modified": "2001-10-05T00:00:00",
    "file_path": null,
    "id": 2,
    "meter_description": "5/8X3/4 BADGER M-25 # 96605029 BOX # 8958059 EAST",
    "notes": null,
    "parcelid": "1824427027",
    "property_description": "BLOCK 3  LOT 11     FOREST PARK ESTATES",
    "sewer_date": null,
    "sewer_description": "SAME TRENCH AS WATER",
    "sewer_laid_by": "B.H. HESELTON CO",
    "sewer_material": "4\" PVC",
    "water_date": null,
    "water_laid_by": "B.H. HESELTON CO -1978",
    "water_materials": "3/4\" COPPER TO CURB STOP",
    "water_re_laid_by": null
  })
});

export let config = {
  connections: [
  //   {
  //   title: 'Tap Card',
  //   connection: Card,
  //   fields: ['property_description', 'parcelid', 'water_laid_by'],
  //   parameters: {
  //     //filters: [{"name": "meter_description", "op": "not_like", "val": "%RIPKA%"}],
  //     page: 100
  //   }
  // },
  {
    title: 'Task',
    connection: TaskConnection,
    parameters: {
      //filters: [{"name": "meter_description", "op": "not_like", "val": "%RIPKA%"}],
      // page: 100
    }
  }]
};
