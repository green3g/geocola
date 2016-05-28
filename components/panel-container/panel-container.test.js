import q from 'steal-qunit';
import can from 'can';

import { ViewModel } from './panel-container';

let vm;

q.module('components/panel-container.ViewModel', {
  beforeEach() {
    vm = new ViewModel();
  },
  afterEach() {
    vm = null;
  }
});

test('toggle()', assert => {
  vm.attr('open', false);
  vm.toggle();
  assert.equal(vm.attr('open'), true, 'after toggling a panel, it should be open');
});

test('hide()', assert => {
  vm.on('hide', (event, obj) => {
    assert.equal(obj, vm, 'hide event should emit the view model');
  });
  vm.hide();
  assert.equal(vm.attr('visible'), false, 'after hiding a panel it should not be visible');
});

test('show()', assert => {
  vm.on('show', (event, obj) => {
    assert.equal(obj, vm, 'show event should emit the view model');
  });
  vm.show();
  assert.equal(vm.attr('visible'), true, 'after showing a panel it should be visible');
});
