/*jshint esnext: true */
import testrunner from 'steal-qunit';
import can from 'can';

import 'components/ol-map/';
import 'components/ol-popup/';
import 'components/identify-widget/';
import 'components/ol-layer/ol-layer-tilewms';

import template from 'components/ol-map/test/mapTemplate.stache!';
import {ViewModel} from 'components/identify-widget/';
import IdentifyResult from './identify-result';

var vm, mapModel, popupModel, FeatureCollection, coordinate;
var clickKey = 'mykey';
var Coord = [-10566654.790142762, 5439870.428999424];
testrunner.module('components/identify-widget/identifyViewModel', {
  beforeEach: function() {
    FeatureCollection = can.extend({}, IdentifyResult);
    coordinate = [Coord[0], Coord[1]];
    //render our map template
    can.$('#qunit-fixture').append(can.view(template, {}));

    mapModel = can.$('ol-map').viewModel();
    mapModel.attr('defaultClick', clickKey);
    popupModel = can.$('ol-popup').viewModel();

    //create a new viewModel for testing
    vm = new ViewModel({
      mapClickKey: clickKey
    });
  },
  afterEach: function(assert) {
    vm = mapModel = popupModel = null;
  }
});

test('initWidget', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  mapModel.setDefaultClickHandler(vm.attr('mapClickKey'));
  assert.equal(mapModel.attr('defaultClick'), vm.attr('mapClickKey'), 'default map click is initialized to default');
});
test('initWidget without popup', function(assert) {
  vm.initWidget({
    map: mapModel
  });
  mapModel.setDefaultClickHandler(vm.attr('mapClickKey'));
  assert.equal(mapModel.attr('defaultClick'), vm.attr('mapClickKey'), 'default map click is initialized to default');
});

test('onMapClick, updateLoading', function(assert) {
  var done = assert.async();
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  mapModel.ready().then(function() {
    mapModel.onMapClick({
      coordinate: coordinate
    }).then(function(features) {
      assert.equal(features.length, 1, 'features should have a count of 1 at this coordinate');
      assert.ok(features[0].getGeometry(), 'feature should have a geometry');
      done();
    });
  });
});

test('addFeatures', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  //add layerProperties to exclude the states layer
  vm.attr('layerProperties', {
    states: {
      excludeIdentify: true
    }
  });
  vm.addFeatures(FeatureCollection, coordinate);
  assert.equal(vm.attr('features').length, 2, 'features should have a length of 2 since we are excluding 2');
  vm.attr('features').forEach(function(feature) {
    assert.ok(feature.getGeometry(), 'features should have a geometry');
  });
});

test('gotoNext', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  vm.addFeatures(FeatureCollection, coordinate);
  var max = vm.attr('features').length - 1;
  //goto last feature (of 4)
  for (var i = 1; i < 10; i++) {
    vm.gotoNext();
    assert.equal(vm.attr('activeFeatureIndex'), i < max + 1 ? i : max, 'current feature index should be ' + (i < max + 1 ? i : max) + ' after going to next');
  }
});

test('gotoPrevious', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  vm.addFeatures(FeatureCollection, coordinate);
  vm.attr('activeFeatureIndex', vm.attr('features').length - 1);
  //goto last feature (of 4)
  for (var i = 10; i > 0; i--) {
    vm.gotoPrevious();
    assert.equal(vm.attr('activeFeatureIndex'), i - 8 > 0 ? i - 8 : 0, 'current feature index should be ' + (i - 8 > 0 ? i - 8 : 0) + ' after going to previous');
  }
});

test('hasNextFeature', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  vm.addFeatures(FeatureCollection, coordinate);
  assert.ok(vm.attr('hasNextFeature'), 'hasNextFeature should be true');
  assert.notOk(vm.attr('hasPreviousFeature'), 'hasPreviousFeature should not be true');
});

test('hasPreviousFeature', function(assert) {
  vm.initWidget({
    map: mapModel,
    popup: popupModel
  });
  vm.addFeatures(FeatureCollection, coordinate);
  //goto last feature (of 4)
  vm.gotoNext().gotoNext().gotoNext();
  assert.notOk(vm.attr('hasNextFeature'), 'hasNextFeature should not be true');
  assert.ok(vm.attr('hasPreviousFeature'), 'hasPreviousFeature should not be true');
});

test('activeFeature', function(assert) {
  vm.initWidget({
    map: mapModel
  });
  var a;
  vm.addFeatures(FeatureCollection, coordinate);
  var f = vm.attr('activeFeature');
  assert.equal(f.feature, vm.attr('features')[0], 'feature should be in the object returned');
  assert.ok(f.featureTemplate, 'feature should have a template');
  assert.ok(f.layer, 'feature should have a layer name');
  assert.ok(f.title, 'feature should have a title');
  assert.ok(f.index, 'feature should have a index number');
  for (a in f.attributes) {
    if (f.attributes.hasOwnProperty(a)) {
      assert.ok(f.attributes[a].rawValue, 'attribute should have a rawValue');
      assert.ok(f.attributes[a].value, 'attribute should have a value');
      assert.ok(f.attributes[a].alias, 'attribute should have a alias');
    }
  }

  var dummy = 'dummy';
  vm.attr('layerProperties', {
    not_states: {
      alias: dummy,
      template: dummy,
      properties: {
        STATE_NAME: {
          alias: dummy,
          formatter: function() {
            return dummy;
          }
        }
      }
    }
  });
  f = vm.attr('activeFeature');
  assert.equal(f.feature, vm.attr('features')[0], 'feature should be in the object returned');
  assert.equal(f.featureTemplate, dummy, 'feature should have a template');
  assert.equal(f.layer, 'not_states', 'feature should have a layer name');
  assert.equal(f.title, dummy, 'feature should have a title');
  assert.ok(f.index, 'feature should have a index number');
  for (a in f.attributes) {
    if (f.attributes.hasOwnProperty(a)) {
      assert.ok(f.attributes[a].rawValue, 'attribute should have a rawValue');
      assert.ok(f.attributes[a].value, 'attribute should have a value');
      assert.ok(f.attributes[a].alias, 'attribute should have a alias');
    }
  }
  assert.equal(f.attributes.STATE_NAME.alias, dummy, 'STATE_NAME alias should be dummmy ');
  assert.equal(f.attributes.STATE_NAME.value, dummy, 'STATE_NAME value should be dummmy ');
  assert.notEqual(f.attributes.STATE_NAME.rawValue, dummy, 'STATE_NAME rawValue should not be dummy ');
});
