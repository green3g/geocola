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

export let config = {
  models: [{
    title: 'Task',
    connection: TaskConnection,
    parameters: {
      'page[size]': 100
    },
    tableFields: ['name', 'description'],
    editFields: ['name', 'description'],
    detailFields: ['name', 'description', 'date_created', 'date_modified', 'id'],
  }]
};

console.log(TaskConnection);
