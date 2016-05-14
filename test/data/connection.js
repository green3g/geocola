import SuperMap from 'can-connect/can/super-map/';
import CanMap from 'can/map/';
import List from 'can/list/';
import './fixtures';

export const TaskMap = CanMap.extend({
  "id": 1,
  "name": "name of task",
  "description": "description of task"
});

export const TaskList = List.extend({
  map: TaskMap
});

export const Connection = SuperMap({
  idProp: "id",
  Map: TaskMap,
  List: TaskList,
  url: "/tasks",
  name: "task"
});
