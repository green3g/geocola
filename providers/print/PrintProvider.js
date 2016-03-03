/*jshint esnext:true */
import Map from 'can/map/';

export default Map.extend({
  define: {
    dpis: {
      Value: can.List
    },
    layouts: {
      Value: can.List
    },
    scales: {
      Value: can.List
    },
    outputFormats: {
      Value: can.List
    }
  },
  loadCapabilities: function(){},
  print: function(){}
});
