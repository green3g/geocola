import template from './property-table.stache!';
// import './property-table.css!';
import viewModel from '../widget-model';
import List from 'can/list/';
import CanMap from 'can/map/';
import Component from 'can/component/';
import { makeSentenceCase } from '../../util/string';
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
    fields: {
      Value: List,
      get(fields) {
        return fields.filter(f => {
          return !f.attr('excludePropertyTable');
        });
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
  },
  getValue(field) {
    return field.getFormattedValue(this.attr('object'));
  }
});

export default Component.extend({
  tag: 'property-table',
  viewModel: ViewModel,
  template: template
});
export default viewModel;
