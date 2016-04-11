/* jshint esnext: true */
import template from './property-table.stache!';
// import './property-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import CanMap from 'can/map/';
import Component from 'can/component/';

/**
 * @module property-table
 */

/**
 * @typedef {tablePropertiesObject} property-table.types.tablePropertiesObject tablePropertiesObject
 * An object consisting of a key representing the field name and the value being properties defining each field's appearance
 * @parent property-table.types
 * @option {String} alias The label to display for this field. The default is replace underscores with spaces
 * and capitalize the first letter
 * @option {Boolean} exclude If set to true, this field will not display in the identify widget
 * @option {function(value, attributes)} formatter An optional formatter function for the field's value that will return a string. This function may accept two arguments, the first being the property value, and the second being an object with all of the objects properties. This is provided in case a developer wants to use other proerties to format a value.
```
formatter: function(name, props) {
   return name + ' is Awesome! and my other prop is' + props.otherProp;
 }
 ```

 * @description

## Example

```
var fieldProps = {
  bbox: {
    exclude: true
  },
  STATE_NAME: {
    alias: 'Name',
    formatter: function(name, properties) {
      return name + ' is Awesome!</strong>';
    }
  }
};
```
 */

/**
 * @typedef {tableValuesObject} property-table.types.tableValuesObject tableValuesObject
 * @parent property-table.types
 * An object used by the template to render the fields and their formatted values
 * @option {String} field The unformatted field name
 * @option {String} alias The formatted field name or alias
 * @option {String | Number | Boolean} value The formatted value
 * @option {String | Number | Boolean} rawValue The unformatted value
 *
 */


export const ViewModel = viewModel.extend({
  define: {
    /**
     * A flag to allow editing (Not yet implemented)
     * @property {Boolean} property-table.props.edit
     * @parent property-table.props
     */
    edit: {
      type: 'boolean',
      value: true
    },
    /**
     * A flag to allow deleting (Not yet implemented)
     * @property {Boolean} property-table.props.delete
     * @parent property-table.props
     */
    delete: {
      type: 'boolean',
      value: true
    },
    /**
     * The ID value of the object that should be retrieved. This value along with the connection object will be used to retrieve an object from a RESTful service
     * @property {Number} property-table.props.objectId
     * @parent property-table.props
     */
    objectId: {
      type: 'number',
      set: function(id) {
        this.fetchObject(this.attr('connection'), id);
        return id;
      }
    },
    /**
     * The The connection object that should be used to retrieve an object. This value along with the objectId value will be used to retrieve an object from a RESTful service
     * @property {providers.apiProvider} property-table.props.connection
     * @parent property-table.props
     */
    connection: {
      set: function(con) {
        this.fetchObject(con, this.attr('objectId'));
        return con;
      }
    },
    /**
     * A generic object to display in a tabular format. This can be used instead of providing a connection and objectId property
     * @property {can.Map | Object} property-table.props.object
     * @parent property-table.props
     */
    object: {
      Type: CanMap
    },
    /**
     * A configuration object defining exactly how to display the properties fields and values
     * @property {property-table.types.tablePropertiesObject} property-table.props.fieldProperties
     * @parent property-table.props
     */
    fieldProperties: {
      value: null
    },
    /**
     * A virtual property that returns an object consisting of the formatted fields, values, and layer properties.
     * @parent property-table.props
     * @property {property-table.types.tableValuesObject} property-table.props.attributes
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
               !fieldProperties.attr([prop, 'exclude'].join('.'))) {

              //add a new property
              attributes[prop] = {

                //the field name
                field: prop,

                //alias defaults to the formatted property name if not provided
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
