/* jshint esnext: true */
import statesTemplate from './states.stache!';

export default {
  'GISDATA\.TOWNS_POLYM': {
    alias: 'Cities'
  },
  states: {
    alias: 'US States',
    template: statesTemplate,
    properties: {
      geometry: {
        exclude: true
      },
      bbox: {
        exclude: true
      },
      STATE_NAME: {
        alias: 'Name',
        formatter: function(name) {
          return name + ' is Awesome!';
        }
      }
    }
  }
};
