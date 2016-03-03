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
        return can.ajax({
          url: this.resource,
          headers: {
            'Accept': 'application/vnd.api+json'
          },
          method: 'GET',
          data: data || {}
        });
      },
      getData: function(data){
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
        return can.ajax({
          url: this.resource + '/' + attrs[id],
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          data: JSON.stringify({
            data: {
              attributes: attrs,
              type: options.name,
              id: attrs.id
            }
          }),
          method: 'PATCH'
        });
      },
      destroyData: function(attrs){
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
      if(props && props.data){
        props = props.data;
      }
      if(!props){
        return {};
      }
      var obj = props.attributes;
      obj.id = props.id;
      return obj;
    },
    idProp: id
  });
  //return the object with the necessary list, map, and connection props
  return {
    connection: connection,
    map: options.map,
    list: options.map.List
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
