
import statesTemplate from './states.stache!';

export default {
  states: {
    //these first properties control how the layer overall will display
    //in the identify-widget
    alias: 'US States',
    template: statesTemplate,
    fieldProperties: {
      //these properties specify how each field should be displayed
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
  },
  'GISDATA\.TOWNS_POLYM': {
    alias: 'Cities'
  }
};
