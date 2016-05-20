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
