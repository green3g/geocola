/* jshint esnext: true */
import template from './property-table.stache!';
// import './property-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import Map from 'can/map/';
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
    objectId: {
      type: 'number',
      set: function(id){
        this.fetchObject(this.attr('connection'), id);
        return id;
      }
    },
    connection: {
      set: function(con){
        this.fetchObject(con, this.attr('objectId'));
        return con;
      }
    },
    object: {
      Type: Map
    },
    fields: {
      value: null
    }
  },
  fetchObject: function(con, id){
    if(!con || !id){
      return;
    }
    var self = this;
    return con.get({
      id: id
    }).then(function(obj){
      self.attr('object', obj);
    });
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
  tag: 'property-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
