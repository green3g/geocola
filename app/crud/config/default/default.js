import { TaskInfo, TaskFields } from './models/Task';
import { ViewMap } from 'can-crud/crud-manager/ViewMap';

import 'can-crud/form-widget/field-components/date-field/';

export let config = {
  views: [new ViewMap({
    connection: TaskInfo,
    objectTemplate: TaskInfo.Map,
    iconClass: 'fa fa-tasks',
    id: 'task',
    title: 'Tasks',
    fields: TaskFields
  })]
};
