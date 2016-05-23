import q from 'steal-qunit';
import can from 'can';

import {ViewModel} from './crud-manager';

let vm;

q.module('components/.ViewModel', {
  beforeEach: () => {
    vm = new ViewModel();
  },
  afterEach: () => {
    vm = null;
  }
});

test('totalPages get()', assert => {

});

test('objects get()', assert => {
  let done = assert.async();

});

test('focusObject get()', assert => {
  let done = assert.async();

});

test('buttons get()', assert => {

});

test('queryPage set()', assert => {

});

test('queryPageNumber set()', assert => {

});

test('queryPerPage set()', assert => {

});

test('_fields get()', assert => {

});

test('init()', assert => {

});

test('editObject(scope, dom, event, obj)', assert => {

});

test('viewObject(scope, dom, event, obj)', assert => {

});

test('saveObject(scope, dom, event, obj)', assert => {

});

test('resetPage()', assert => {

});

test('createObject()', assert => {

});

test('getNewObject()', assert => {

});

test('deleteObjects(scope, dom, event, obj, skipConfirm)', assert => {

});

test('deleteMmultiple()', assert => {

});

test('setFilterParameter(filters)', assert => {

});

test('setSortParameter(sort)', assert => {

});

test('toggleFilter(val)', assert => {

});

test('isListTable()', assert => {

});

test('getRelatedValue(foreignKey, focusObject)', assert => {

});
