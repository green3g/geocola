import {
  Filter,
  ViewModel
} from './filter-widget';

import q from 'steal-qunit';

var vm, filter;

q.module('components/filter-widget.ViewModel', {
  beforeEach: function() {
    vm = new ViewModel();
    filter = new Filter({
      name: 'test',
      op: 'equals',
      val: 'test'
    });
  },
  afterEach: function() {
    filter = null;
    vm = null;
  }
});

test('formFields get()', assert => {
  assert.equal(vm.attr('formFields')[0].type, 'text', 'name field type should be text by default');

  let field = {
    name: 'test',
    alias: 'Test'
  };
  vm.attr('fields', [field]);
  assert.equal(vm.attr('formFields')[0].type, 'select', 'name field type should be select when there are fieldOptions');
});

test('fields get()', assert => {
  let fields = [{
    name: 'test',
    excludeFilter: true
  }, {
    name: 'test2'
  }];
  vm.attr('fields', fields);
  assert.equal(vm.attr('fields').length, 1, 'With excludeFilter true, only one field should be retreived from the getter');
});

test('addFilter()', assert => {
  vm.addFilter(null, null, null, filter);
  assert.equal(vm.attr('filters').length, 1, 'filters should been added');
});

test('addFilter() with filterFactory', assert => {
  vm.attr('fields', [{
    name: 'test',
    filterFactory(filter) {
      return [new Filter({
        name: 'test',
        op: 'equals',
        val: 'test'
      }), new Filter({
        name: 'test',
        op: 'equals',
        val: 'test'
      })];
    }
  }]);
  vm.addFilter(null, null, null, filter);
  assert.equal(vm.attr('filters').length, 2, 'factoryFunction should be called and two filters should be created');
});

test('removeFilter()', assert => {
  vm.addFilter(null, null, null, filter);
  vm.removeFilter(null, null, null, filter);
  assert.equal(vm.attr('filters').length, 0, 'filters should have been removed');
});


test('fieldOptions get() with fields', assert => {
  let fields = [{
    name: 'test',
    alias: 'Other'
  }];
  vm.attr('fields', fields);
  assert.equal(vm.attr('fieldOptions').length, fields.length, 'when fields are provided, fieldOptions should be created from the value');
});

test('fieldOptions get() with objectTemplate', assert => {
  let template = can.Map.extend({
    test1: null,
    test2: null,
    test3: null
  });
  let len = can.Map.keys(new template()).length;
  vm.attr('objectTemplate', template);
  assert.equal(vm.attr('fieldOptions').length, len, 'when no fieldOptions are provided, but objectTemplate is, fieldOptions.length should be length of objectTemplate keys');
});

q.module('components/filter-widget.Filter', {
  beforeEach: function() {
    filter = new Filter({});
  },
  afterEach: function() {
    filter = null;
  }
});

test('val set()', assert => {
  assert.equal(filter.attr('op'), 'like', 'default operator should be like');

  let value = 'test';
  filter.attr('val', value);
  assert.equal(filter.attr('val'), '%' + value + '%', 'after setting value when op is like, the value should be %value%');

  filter.attr('op', 'equals');
  filter.attr('val', value);
  assert.equal(filter.attr('val'), value, 'after setting value when op is not like, value should be value');

  value = '2.5';
  filter.attr('op', 'greater_than');
  filter.attr('val', value);
  assert.equal(typeof filter.attr('val'), 'number', 'after setting value when op is number comparator, value should be a number');
});
