import data from './tasks.json';
import fixture from 'can/util/fixture/';

//a mock ajax service
fixture({
  '/tasks': function() {
    return data;
  },
  '/tasks/{id}': function(params) {
    let items = data.filter(function(item) {
      return item.id == params.data.id;
    });
    return items.length ? items[0] : null;
  }
});
