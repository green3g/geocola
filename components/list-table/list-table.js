/* jshint esnext: true */
import template from './list-table.stache!';
import './list-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Component from 'can/component/';

export const ViewModel = viewModel.extend({
  define: {
    edit: {
      type: 'boolean',
      value: true
    },
    delete: {
      type: 'boolean',
      value: true
    },
    promise: {
      set: function(newVal) {
        var self = this;
        newVal.then(function(objects) {
          self.attr('objects').replace(objects);
        });
        return newVal;
      }
    },
    objects: {
      value: List
    },
    selectedObjects: {
      Value: List
    },
    allSelected: {
      get: function() {
        return this.attr('objects').length === this.attr('selectedObjects').length;
      }
    }
  },
  buttonClick: function(event, object) {
    this.dispatch(event.eventName, [object]);
  },
  toggleSelected: function(obj) {
    var index = this.attr('selectedObjects').indexOf(obj);
    if (index > -1) {
      this.attr('selectedObjects').splice(index, 1);
    } else {
      this.attr('selectedObjects').push(obj);
    }
  },
  toggleSelectAll: function() {
    if (this.attr('allSelected')) {
      this.attr('selectedObjects').replace([]);
    } else {
      this.attr('selectedObjects').replace(this.attr('objects'));
    }
  },
  isSelected: function(obj) {
    return this.attr('selectedObjects').indexOf(obj) > -1;
  },
  renderField: function(fieldName) {
    return !this.attr('fields') ? fieldName : this.attr('fields').indexOf(fieldName) > -1;
  },
  formatField: function(fieldName) {
    fieldName = String(fieldName);
    return [fieldName.substring(0, 1).toUpperCase(), fieldName.substring(1, fieldName.length).replace(/_/g, " ")].join('');
  },
  formatValue: function(value) {
    return value;
  }
});

export default Component.extend({
  tag: 'list-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
