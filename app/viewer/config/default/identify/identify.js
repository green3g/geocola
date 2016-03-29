/* jshint esnext: true */
import statesTemplate from './states.stache!';

export default {
  'GISDATA\.TOWNS_POLYM': {
    alias: 'Cities'
  },
  states: {
    alias: 'US States',
    template: statesTemplate,
    fieldProperties: {
      geometry: {
        exclude: true
      },
      bbox: {
        exclude: true
      },
      STATE_NAME: {
        alias: 'Name',
        formatter: function(name, properties) {
          return [
            'See app/viewer/config/default/identify/identify.js</strong>',
            '<br />',
            'to see how this is done:<br /><strong>',
            name,
            ' is Awesome!</strong>'
          ].join('');
        }
      }
    }
  }
};
