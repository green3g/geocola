import q from 'steal-qunit';
import can from 'can';
import { Connection } from 'test/data/connection';
import { ViewModel } from './property-table';
import CanMap from 'can/map/';

let vm;

q.module('components/property-table.ViewModel', {
  beforeEach: () => {
    vm = new ViewModel();
  },
  afterEach: () => {
    vm = null;
  }
});

test('fetchObject(con, id)', assert => {
  let done = assert.async();
  vm.fetchObject(Connection, 11).then(data => {

    assert.ok(vm.attr('object'), 'the table should have an object after an object is fetched');
    done();
  });
});

test('objectId set(id)', assert => {
  let done = assert.async();
  let id = 2;
  vm.attr('connection', Connection);
  assert.notOk(vm.attr('objectPromise'), 'objectPromise should not have a value by default');

  vm.attr('objectId', id);
  assert.ok(vm.attr('objectPromise'), 'objectPromise should have a value after setting the objectId');

  vm.attr('objectPromise').then(object => {
    assert.equal(vm.attr('object.id'), id, 'objects id should match the id that was set');
    done();
  });
});

test('attributes get() no fieldProperties', assert => {
  let map = new CanMap({
    prop1: 'test1'
  });
  let expected = {
    prop1: {
      field: 'prop1',
      alias: 'Prop1',
      value: 'test1',
      rawValue: 'test1'
    }
  };
  assert.deepEqual(vm.attr('attributes'), {}, 'if there is no object, attributes should be empty');

  vm.attr('object', map);
  assert.deepEqual(vm.attr('attributes').attr(), expected, 'attributes should be created with the expected properties');
});

test('attributes get() with fieldProperties', assert => {
  let map = new CanMap({
    prop1: 'test1',
    prop2: 'test2'
  });
  let fieldProps = {
    prop1: {
      alias: 'Alias',
      formatter: val => {
        return 'formatted';
      }
    },
    prop2: {
      exclude: true
    }
  };
  let expected = {
    prop1: {
      field: 'prop1',
      alias: 'Alias',
      value: 'formatted',
      rawValue: 'test1'
    }
    //prop2 should be excluded 
  };

  vm.attr('object', map);
  vm.attr('fieldProperties', fieldProps);
  assert.deepEqual(vm.attr('attributes').attr(), expected, 'attributes should be created with the expected properties');
});
