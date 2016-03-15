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
      set: function(id) {
        this.fetchObject(this.attr('connection.connection'), id);
        return id;
      }
    },
    connection: {
      set: function(con) {
        this.fetchObject(con.attr('connection'), this.attr('objectId'));
        return con;
      }
    },
    object: {
      Type: Map
    },
    fields: {
      value: null
    },
    formatters: {
      value: null
    },
    /**
     * A virtual property that returns an object consisting of the formatted fields, values, and layer properties.
     * @parent property-table.parameters
     * @property {can.Map}
     */
    /**
     * @typedef {fieldPropertiesObject} identify-widget.types.fieldPropertiesObject fieldPropertiesObject
     * An object consisting of a key representing the field name and the value being properties defining each field's appearance
     * @parent identify-widget.types
     * @option {String} alias The label to display for this field. The default is replace underscores with spaces
     * and capitalize the first letter
     * @option {Boolean} exclude If set to true, this field will not display in the identify widget
     * @option {function(value, attributes)} formatter An optional formatter function for the field's value that will return a string.
    ```
    formatter: function(name, props) {
       return name + ' is Awesome! and my other prop is' + props.otherProp;
     }
     ```
     */
    attributes: {
      get: function() {
        var obj = this.attr('object');
        if (!obj) {
          return {};
        }

        var props = obj.attr();
        var attributes = {};
        var fieldProperties = this.attr('fieldProperties');
        if (fieldProperties) {
          //build a new attribute list
          for (var prop in props) {
            if (props.hasOwnProperty(prop) &&
              //if we don't have field properties for this layer or we do
              //and the exclude property is false or undefined, show this field
              (!fieldProperties || !fieldProperties.attr([prop, 'exclude'].join('.')))) {

              //add a new property
              attributes[prop] = {

                //the field name
                field: prop,

                //alias defaults to the property name if not provided
                alias: fieldProperties.attr([prop, 'alias'].join('.')) || this.formatField(prop),

                //value gets formatted if there's a formatter function
                value: typeof fieldProperties.attr([prop, 'formatter'].join('.')) === 'function' ?
                  fieldProperties.attr([prop, 'formatter'].join('.'))(props[prop], props) : can.esc(props[prop]),

                //rawValue in case you need access to it
                rawValue: props[prop]
              };
            }
          }
        } else {
          //if we don't have a fieldProperties, build a generic list
          for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
              attributes[prop] = {
                field: prop,
                alias: this.formatField(prop),
                value: props[prop],
                rawValue: props[prop]
              };
            }
          }
        }
        return attributes;
      }
    }
  },
  fetchObject: function(con, id) {
    if (!con || !id) {
      return;
    }
    var self = this;
    return con.get({
      id: id
    }).then(function(obj) {
      self.attr('object', obj);
    });
  },
  renderField: function(fieldName) {
    return !this.attr('fields') ? fieldName : this.attr('fields').indexOf(fieldName) > -1;
  },
  formatField: function(fieldName) {
    fieldName = fieldName.replace(/_/g, " ");
    return [fieldName.substring(0, 1).toUpperCase(), fieldName.substring(1, fieldName.length)].join('');
  },
  formatValue: function(value) {
    var f = this.attr('formatters');
    if (f && f[fieldName]) {
      return f[fieldName](value);
    }
    return value;
  }
});

export default Component.extend({
  tag: 'property-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
