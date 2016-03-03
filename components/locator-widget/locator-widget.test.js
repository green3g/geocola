/*jshint esnext: true */
import testrunner from 'steal-qunit';
import model from 'components/locator-widget/model/locatorModel';

var m;
testrunner.module('components/locator-widget/model', {
  beforeEach: function() {
    m = new model({
      geocodeUrl: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/'
    });
  }
});
