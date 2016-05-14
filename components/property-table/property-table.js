import template from './property-table.stache!';
// import './property-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import CanMap from 'can/map/';
import Component from 'can/component/';
import { makeSentenceCase } from 'util/string';
/**
 * @constructor components/property-table.ViewModel ViewModel
 * @parent components/property-table
 * @group components/property-table.ViewModel.props Properties
 *
 * @description A `<property-table />` component's ViewModel
 */
export const ViewModel = viewModel.extend({
  define: {
    /**
     * A flag to allow editing (Not yet implemented)
     * TODO: implement editing
     * @property {Boolean} property-table.props.edit
     * @parent property-table.props
     */
    edit: {
      type: 'boolean',
      value: true
    },
    /**
     * A flag to allow deleting (Not yet implemented)
     * TODO: implement deleting
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
      set(id) {
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
      set(con) {
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
     * A promise that resolves to the object. Used to determine state of current fetching operations
     * @property {Promise | `null`}  property-table.props.objectPromise
     * @parent property-table.props
     */
    objectPromise: {},
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
      get() {
        var obj = this.attr('object');
        if (!obj) {
          return {};
        }

        var props = obj.attr();
        var attributes = {};
        var fieldProperties = this.attr('fieldProperties');
        var prop;
        if (fieldProperties) {
          //build a new attribute list
          for (prop in props) {
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
          for (prop in props) {
            if (props.hasOwnProperty(prop)) {
              attributes[prop] = {
                field: prop,
                alias: makeSentenceCase(prop),
                value: props[prop],
                rawValue: props[prop]
              };
            }
          }
        }
        return new CanMap(attributes);
      }
    }
  },
  fetchObject(con, id) {
    if (!con || !id) {
      return;
    }
    let self = this;
    let def = con.get({
      id: id
    });
    def.then(obj => {
      self.attr('object', obj);
    });

    this.attr('objectPromise', def);
    return def;
  }
});

export default Component.extend({
  tag: 'property-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
