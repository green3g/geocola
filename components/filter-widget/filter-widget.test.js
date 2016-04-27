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

  filter.attr('op', '==');
  filter.attr('val', value);
  assert.equal(filter.attr('val'), value, 'after setting value when op is not like, value should be value');
});
