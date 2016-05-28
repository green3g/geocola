/*jshint esnext: true */
import testrunner from 'steal-qunit';
import Model from 'components/print-widget/model/printViewModel';
import can from 'can';
import ol from 'openlayers';
import $ from 'jquery';
var vm, map;
testrunner.config.testTimeout = 10000;
testrunner.module('components/print-widget/model', {
  beforeEach: function() {
    vm = new Model({
      printUrl: 'http://localhost/geoserver/pdf/info.json',
    });
    $('#qunit-fixture').append('<div id="map" />');
    map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            attributions: [
              new ol.Attribution({
                html: 'All maps &copy; ' +
                  '<a href="http://www.openseamap.org/">OpenSeaMap</a>'
              }),
              ol.source.OSM.ATTRIBUTION
            ],
            crossOrigin: null,
            url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.TileWMS({
            url: 'http://demo.boundlessgeo.com/geoserver/wms',
            params: {
              'LAYERS': 'ne:ne'
            },
            serverType: 'geoserver',
            crossOrigin: ''
          })
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: 1
      })
    });
  },
  afterEach: function(assert) {
    map = null;
  }
});
test('fetchServiceJson', function(assert) {
  var done = assert.async();
  var deferred = vm.fetchServiceJson();
  deferred.then(function(response) {
    assert.ok(response.scales, 'response should contain a scales property');
    assert.ok(response.dpis, 'response should contain a dpis property');
    assert.ok(response.outputFormats, 'response should contain outputFormats property');
    assert.ok(response.layouts, 'response should contain a layouts property');
    assert.ok(response.createURL, 'resposne should contain a createURL property');
    done();
  });
  deferred.error(function(e){
    assert.ok(e, 'the server was unable to return a response and threw an error + e');
    console.log(e);
    done();
  });
});

test('handlePrintInfo', function(assert) {
  var done = assert.async();
  var d = vm.fetchServiceJson();
  d.then(function(data) {
    vm.handlePrintInfo(data);
    assert.ok(vm.attr('printInfo').scales, 'vm.attr(printInfo) should contain a scales property');
    assert.ok(vm.attr('printInfo').dpis, 'vm.attr(printInfo) should contain a dpis property');
    assert.ok(vm.attr('printInfo').outputFormats, 'vm.attr(printInfo) should contain outputFormats property');
    assert.ok(vm.attr('printInfo').layouts, 'vm.attr(printInfo) should contain a layouts property');
    assert.ok(vm.attr('printInfo').createURL, 'vm.attr(printInfo) should contain a createURL property');
    done();
  });
});

test('getPrintObject', function(assert) {
  var done = assert.async();
  vm.attr('promise').then(function() {
    var o = vm.getPrintObject(map);
    assert.equal(typeof o.srs, 'string', 'srs should be a string');
    assert.equal(typeof o.units, 'string', 'units should be a string');
    assert.equal(o.layers.length, 2, 'layers should have a length of 2');
    o.layers.forEach(function(layer) {
      console.log(layer);
      assert.equal(typeof layer.type, 'string', 'each layer should have a <string>type');
      assert.equal(typeof layer.baseURL, 'string', 'each layer should have a string baseURL');
    });
    done();
  });
});

test('parseUrl', function(assert) {
  var relative = vm.parseUrl('http://example.com/not/this/part/');
  var another = vm.parseUrl('http://localhost:8080/geoserver/something');
  assert.equal(relative.hostname, 'example.com', 'hostname should be identified correctly');
  assert.equal(another.pathname, '/geoserver/something','pathname should be identified correctly');
  assert.equal(another.protocol, 'http:','protocol should be identified correctly');
});

test('createPrint', function(assert) {
  var done = assert.async();
  vm.attr('promise').then(function() {
    vm.createPrint(map);
    vm.attr('promise').then(function(printData) {
      assert.equal(typeof printData.getURL, 'string', 'the function should have a string url property');
      done();
    });
  });
});

//additional tests
//getMapScale
