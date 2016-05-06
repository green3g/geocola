import { FlaskConnectFactory } from 'providers/api/FlaskModelFactory';
import Map from 'can/map/';

export let Task = {
  connection: FlaskConnectFactory({
    url: '/api/tasks_task',
    name: 'tasks_task',
    map: Map.extend({
      name: 'test',
      description: 'test',
      yes_or_no: false
    })
  }),
  title: 'Tasks',
  id: 'tasks'
};
