/*jshint esnext: true */
import testrunner from 'steal-qunit';

let model = {
  myCustomProperty: 'sample config'
};

var m;
testrunner.module('widget-module', {
  beforeEach: function() {
    m = new model({
      widgetId: null,
      config: null
    });
  }
});

test('init function', function(assert) {
  m.init();
  assert.ok(m.attr('widgetId'), 'widgetId should not be falsy');
});

test('loadConfig function', function(assert) {
  var done = assert.async();
  m.loadConfig('test/widget-model/config');
  m.attr('configLoading').then(function(config) {
    assert.deepEqual(config.default, {
      myCustomProperty: 'sample config'
    }, 'config should be loaded correctly');
    assert.equal(m.attr('myCustomProperty'), 'sample config',
      'the property from config should exist in the widget');
    done();
  });
});
