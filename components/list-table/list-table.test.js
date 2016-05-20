import q from 'steal-qunit';
import can from 'can';

import {
  ViewModel
} from './list-table';

let vm,
objects = [{
  name: 'one',
  label: 'label1'
}, {
  name: 'two',
  label: 'label2'
}];

q.module('components/list-table.ViewModel', {
  beforeEach: () => {
    vm = new ViewModel({
      objects: objects
    });
  },
  afterEach: () => {
    vm = null;
  }
});
test('buttonClick(eventName, object)', assert => {
  let eventName = 'my-event';
  let myObj = {
    myObj: 'myObj'
  };
  let done = assert.async();
  vm.on(eventName, (event, obj) => {
    console.log(arguments);
    assert.deepEqual(obj, myObj, 'event should emit the correct object');
    assert.deepEqual(event, {
      type: eventName
    }, 'event should be the correct name');
    done();
  });
  vm.buttonClick(eventName, myObj);
});

test('setSort(field)', assert => {
  let fieldName = 'name';
  let otherField = 'label';
  vm.setSort(fieldName);
  assert.deepEqual(vm.attr('currentSort').attr(), {
    type: 'asc',
    fieldName: fieldName
  }, 'Current sort should be ascending and set to field');

  vm.setSort(fieldName);
  assert.deepEqual(vm.attr('currentSort').attr(), {
    type: 'desc',
    fieldName: fieldName
  }, 'Current sort should be descending and set to field');

  vm.setSort(otherField);
  assert.deepEqual(vm.attr('currentSort').attr(), {
    type: 'asc',
    fieldName: otherField
  }, 'Current sort should be ascending and set to field');
});

test('toggleSelected(obj), isSelected(obj)', assert => {
  vm.toggleSelected(vm.attr('objects')[0]);
  assert.ok(vm.isSelected(vm.attr('objects')[0]), 'object should be selected');
});

test('toggleSelectAll(), _allSelected', assert => {
  vm.toggleSelectAll();
  vm.attr('objects').forEach((obj) => {
    assert.ok(vm.isSelected(obj), 'each object should be selected');
  });
  assert.ok(vm.attr('_allSelected'), '_allSelected should be truthy');
});
