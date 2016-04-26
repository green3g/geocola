/*jshint esnext: true */
import testrunner from 'steal-qunit';
import ol from 'openlayers';
import can from 'can';

import {ViewModel} from 'components/ol-map/';
import 'components/ol-map/';
import template from './mapTemplate.stache!';

var view = new ol.View({
  center: [20, 20],
  zoom: 11
});

var vm;
var clicked = false;
var selector = '#maptest2';

testrunner.module('components/ol-map/model', {
  beforeEach: function() {
    can.$('#qunit-fixture').append(can.view(template, {

    }));
    can.$('#qunit-fixture').append('<div id="maptest2"></div>');
    vm = new ViewModel({
    });
    var test = function(event) {
      clicked = true;
      return event;
    };
    var test2 = function(event) {
      clicked = true;
      return event;
    };
    vm.addClickHandler('test', test);
    vm.addClickHandler('test2', test2);
  },
  afterEach: function(assert) {
    vm = null;
  }
});
test('initMap with defaults', function(assert) {
  vm.on('ready', function(event, map, viewModel) {
    assert.equal(map.getView().getProjection().getCode(),
      'EPSG:3857', 'Projection should be default');
    assert.deepEqual(map.getView().getCenter(), [0, 0], 'center should be default');
    assert.equal(map.getView().getZoom(), 1, 'zoom should be default');
  });
  vm.initMap($(selector)[0]);
  assert.ok(vm.attr('mapObject'), 'map should be okay');
});
test('addClickHandler', function(assert) {
  assert.equal( vm.attr('currentClick'),'test', 'current click handler should be test');
  assert.equal( vm.attr('defaultClick'),'test', 'default click handler should be test');
});

test('removeClickHandler', function(assert) {
  vm.removeClickHandler('test2');
  assert.notOk(vm.attr('clickHandlers.test2'), 'test2 handler should not exist');
});

test('setCurrentClickHandler', function(assert) {
  vm.setCurrentClickHandler('test2');
  assert.equal(vm.attr('currentClick'), 'test2', 'current Click should be test2');
});

test('setDefaultClickHandler', function(assert) {
  vm.setCurrentClickHandler('test2');
  vm.setDefaultClickHandler();
  assert.equal(vm.attr('currentClick'), 'test', 'current click should be default of test');
});

test('onMapClick', function(assert) {
  assert.notOk(clicked, 'clicked should not yet be okay');
  var result = vm.onMapClick({
    testEvent: "hello"
  });
  assert.ok(clicked, 'clicked should now be okay');
});

testrunner.module('components/ol-map/view', {});
test('insert map into dom with defaults', function(assert) {
  $('#qunit-fixture').html(can.stache('<ol-map />'), {});
  assert.ok($('.ol-viewport').length, 'the ol viewport should be created');
  assert.ok($('.ol-map-container').attr('id'), 'the ol container should have an id');
  var map = $('ol-map').scope().attr('mapObject');
  assert.equal(map.getView().getZoom(), 1, 'zoom should be default');
  assert.deepEqual(map.getView().getCenter(), [0, 0], 'center should be default');
});

test('insert map into dom with values', function(assert) {
  $('#qunit-fixture').html(can.stache('<ol-map x="10" y="10" zoom="8" ' +
    'projection="EPSG:3857"></ol-map>'));
  assert.ok($('.ol-viewport').length, 'the ol viewport should be created');
  var map = $('ol-map').scope().attr('mapObject');
  assert.equal(map.getView().getZoom(), 8, 'zoom should be overridden');
  assert.deepEqual(map.getView().getCenter(), [10, 10], 'center should be overridden');
});
