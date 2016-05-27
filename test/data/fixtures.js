import data from './tasks.json';
import fixture from 'can/util/fixture/';

//a mock ajax service
fixture({
  '/tasks': function() {
    return data;
  },
  '/tasks/{id}': function(params, response) {
    let items = data.filter(function(item) {
      return item.id == params.data.id;
    });
    if(!items.length){
      response( 404, '{type: "Not Found"}');
      return;
    }
    return  items[0];
  }
});
