import {
  Filter,
  ViewModel
} from './filter-widget';

import q from 'steal-qunit';

var vm, filter;

q.module('components/filter-widget.ViewModel', {
  beforeEach: function(){
    vm = new ViewModel();
  },
  afterEach: function(){
    vm = null;
  }
});

test('addFilter()', assert => {
    vm.addFilter(filter);
    assert.equal(vm.attr('filters').length, 1, 'filters should been added');
});

test('removeFilter()', assert => {
      vm.addFilter(filter);
      vm.removeFilter(filter);
      assert.equal(vm.attr('filters').length, 0, 'filters should have been removed');
});

test('fields get()', assert => {
  assert.notOk(vm.attr('fields')[0].type, 'name field type should be falsey by default');

  let fieldOption = {
    label: 'test',
    value: 'test'
  };
  vm.attr('fieldOptions', [fieldOption]);
  assert.equal(vm.attr('fields')[0].type, 'select', 'name field type should be select when there are fieldOptions');
});


test('fieldOptions get() no objectTemplate', assert => {
  let options = [{
    value: 'test1',
    label: 'test1'
  }];
  vm.attr('fieldOptions', options);
  assert.equal(vm.attr('fieldOptions').length, options.length, 'when fieldOptions are provided, the length should be equal to what is provided');

  let objectTemplate = new can.Map({
    test1: null,
    test2: null,
    test3: null
  });
  vm.attr('objectTemplate', objectTemplate);
  assert.equal(vm.attr('fieldOptions').length, options.length, 'when fieldOptions and objectTemplate is provided, length should still be fieldOptions.length');
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
  beforeEach: function(){
    filter = new Filter({});
  },
  afterEach: function(){
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
