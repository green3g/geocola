import can from 'can';
import superMap from 'can-connect/can/super-map/';

var uniqueId = 0;

function getNextId() {
  return uniqueId++;
}

export function FlaskConnectFactory(options) {
  //a new list which should hold the objects
  let Objectist = can.List.extend({
    Map: options.map
  });
  let properties = new can.Map();

  //a default id
  var id = options.idProp || 'id';

  let connection = superMap({
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
          properties.attr({
            meta: props.meta,
          });
        });
        return def;
      },
      getData: function(data) {
        return can.ajax({
          url: this.resource + '/' + data.id,
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
        console.log(attrs);
        var data = {};
        //exclude hidden properties
        for (var a in attrs) {
          if (attrs.hasOwnProperty(a) && a.indexOf('_') !== 0 && attrs[a]) {
            data[a] = attrs[a];
          }
        }
        console.log(data);
        return can.ajax({
          url: this.resource + '/' + attrs[id],
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          data: JSON.stringify({
            data: {
              attributes: data,
              type: options.name,
              id: attrs.id
            }
          }),
          method: 'PATCH'
        });
      },
      destroyData: function(attrs) {
        return can.ajax({
          url: this.resource + '/' + attrs[id],
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
      //sometimes props are actually in the data property?
      if (props.data) {
        props = props.data;
      }
      //build a new object that consists of a combination of the FlaskRestless
      //response object
      var obj = props.attributes;
      obj.id = props.id;
      //include the relationship id's
      for (var rel in props.relationships) {
        if (props.relationships.hasOwnProperty(rel)) {
          obj['_' + rel] = props.relationships[rel].data.id;
        }
      }
      return obj;
    },
    idProp: id
  });
  //return the object with the necessary list, map, and connection props
  return {
    connection: connection,
    map: options.map,
    list: options.map.List,
    properties: properties
  };
};
/**
 * creates a new can.Model that connects to the flask restless api
 * @param  {string} url [description]
 * @return {can.Model}     [description]
 */
export function FlaskRestless(url, options) {
  if (!options) {
    options = {};
  }
  return can.Model.extend({
    id: options.idField || 'id',
    resource: url,
    findAll: 'GET ' + url + '?{filter}&{group}',
    defaults: options.defaults || {},
    parseModels: function(data) {
      return data.objects;
    },
    create: function(attrs) {
      return can.ajax({
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(attrs),
        method: 'POST'
      });
    },
    update: function(id, attrs) {
      return can.ajax({
        url: url + '/' + id,
        contentType: 'application/json',
        data: JSON.stringify(attrs),
        method: 'PUT'
      });
    }
  }, {});
};
