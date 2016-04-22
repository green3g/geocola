/* jshint esnext:true */
import List from 'can/list/';
import CanMap from 'can/map/';
import superMap from 'can-connect/can/super-map/';
import can from 'can/util/';

var uniqueId = 0;

function getNextId() {
  return uniqueId++;
}

/**
 * @typedef {connectInfoObject} apiProvider.types.connectInfoObject ConnectInfoObject
  * @parent apiProvider.types
  * @option {can.Model | superMap} connection The data model used to create, update and delete objects.
  * @option {can.Map | object} map The object used to create new objects. This object can be used to specify default values and properties when creating new empty objects.
 *  @option {can.List | Array} list The list used internally by can-connect
  * @option {Object} properties Additional metadata about the api and data
 */
const PropertiesObject = CanMap.extend({
  define: {
    totalItems: {
      type: 'number',
      value: 0
    },
    relationships: {
      Value: CanMap
    }
  }
});

/**
 * @typedef {FlaskConnectOptions} apiProvider.types.FlaskConnectOptions FlaskConnectOptions
 * @parent apiProvider.types
 * @option {can.Map} map The template object to use when creating new objects. This
 * map can supply default values, getters and setters, and types of properties on an object
 * @option {String} idProp The proerty to use for the id
 * @option {String} name The name of the connection to use. This should be unique across the application, and should reference
 * the data type that flask-restless is serving. Flask Restless defaults to using the tablename as the data type name
 * @option {String} url The url to the Flask-Restless resource
 */

/**
 *
 * A factory function that creates a new Flask-Restless API connection.
  * @parent apiProvider.providers
  * @param {apiProvider.types.FlaskConnectOptions} options The factory options
  * @return {can-connect/can/super-map}
  */
export function FlaskConnectFactory(options) {
  //a new list which should hold the objects
  let Objectist = List.extend({
    Map: options.map
  });
  let properties = new PropertiesObject();
  let idProp = options.idProp || 'id';

  //create and return a new supermap
  return superMap({
    idProp: idProp,
    baseURL: options.url,
    metadata: properties,
    Map: options.map,
    List: options.map.List,
    name: options.name || 'connection' + getNextId(),
    url: {
      resource: options.url,
      //getData params
      //{
      //  filter: filter[objects]= + JSON.stringify(filterObjects[])
      //  group:  'group=' + fieldName
      //}
      // getData: 'GET ' + options.url,
      getListData: function(data) {
        var def = can.ajax({
          url: this.resource,
          headers: {
            'Accept': 'application/vnd.api+json'
          },
          method: 'GET',
          data: data || {}
        });
        def.then(function(props) {
          //cache the raw data for future use
          properties.attr('totalItems', props.meta.total);
        });
        return def;
      },
      getData: function(data) {
        return can.ajax({
          url: this.resource + '/' + data[idProp],
          headers: {
            'Accept': 'application/vnd.api+json'
          },
          method: 'GET'
        });
      },
      createData: function(attrs) {
        //post attributes to the create url
        return can.ajax({
          url: this.resource,
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          data: JSON.stringify({
            data: {
              attributes: attrs,
              type: options.name
            }
          }),
          method: 'POST'
        });
      },
      updateData: function(attrs) {
        var data = {};
        //exclude relationship properties
        for (var a in attrs) {
          if (attrs.hasOwnProperty(a) && !properties.attr('relationships.' + a)) {
            data[a] = attrs[a];
          }
        }
        return can.ajax({
          url: this.resource + '/' + attrs[idProp],
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          data: JSON.stringify({
            data: {
              attributes: data,
              type: options.name,
              id: attrs[idProp]
            }
          }),
          method: 'PATCH'
        });
      },
      destroyData: function(attrs) {
        return can.ajax({
          url: this.resource + '/' + attrs[idProp],
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          method: 'DELETE'
        });
      }
    },
    parseListProp: 'data',
    parseInstanceData: function(props) {
      //if for some reason we don't have an object, return
      if (!props) {
        return {};
      }
      //sometimes props are actually in the data property
      //could be a bug with flask-restless
      if (props.data) {
        props = props.data;
      }
      //build a new object that consists of a combination of the FlaskRestless
      //response object
      var obj = props.attributes;
      obj.id = props[this.idProp];
      //include the relationship id's
      for (var rel in props.relationships) {
        if (props.relationships.hasOwnProperty(rel)) {
          obj[rel] = props.relationships[rel].data || null;
          properties.attr('relationships.' + rel, true);
        }
      }
      return obj;
    }
  });
}
