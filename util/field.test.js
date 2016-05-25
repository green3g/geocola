import q from 'steal-qunit';
import can from 'can';

import {Field} from './field';

let cases = [{
  name: 'one'
}, {
  name: 'two',
  type: 'date'
}, {
  name: 'three',
  alias: 'Custom'
}, {
  name: 'four',
  formatter(val, other){
    return val + other.attr('two');
  }
}];
let fields;

q.module('components/.ViewModel', {
  beforeEach: () => {
    let fields = cases.map(c => {
      return new Field(c);
    });
  },
  afterEach: () => {
    field = null;
  }
});

test('Field.alias default', assert => {
  
});
