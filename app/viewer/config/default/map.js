
import ol from 'openlayers';

var view = {
  zoom: 4,
  projection: 'EPSG:3857',
  center: [-10381543.579497037, 4510420.927406358]
};

var layers = [{
  //layer type
  type: 'TileWMS',
  //layer source options:
  sourceOptions: {
    //required url
    url: 'http://giswebservices.massgis.state.ma.us/geoserver/wms',
    //wms params object
    params: {
      //required layers
      LAYERS: 'massgis:GISDATA.TOWNS_POLYM,massgis:GISDATA.NAVTEQRDS_ARC',
    }
  },
  //additional options to pass to the layer constructor
  //http://openlayers.org/en/v3.7.0/apidoc/ol.layer.Base.html
  options: {
    title: 'Massachussets',
    visible: true
  }
}, {
  type: 'TileWMS',
  sourceOptions: {
    url: 'http://map.ices.dk/geoserver/ext_ref/wms',
    params: {
      LAYERS: 'ext_ref:bluemarble_world',
    }
  },
  options: {
    title: 'Blue Marble',
    visible: true,
    excludeIdentify: true
  }
}, {
  type: 'TileWMS',
  sourceOptions: {
    url: 'http://demo.opengeo.org/geoserver/topp/wms',
    params: {
      LAYERS: 'topp:states'
    }
  },
  options: {
    title: 'States',
    visible: true,
    opacity: 0.5
  }
}, {
  id: 'tasmania',
  type: 'TileWMS',
  sourceOptions: {
    url: 'http://demo.opengeo.org/geoserver/topp/wms',
    params: {
      LAYERS: 'topp:tasmania_roads,topp:tasmania_cities,topp:tasmania_state_boundaries,topp:tasmania_water_bodies'
    }
  },
  options: {
    title: 'Tasmania',
    visible: true
  }
}, {
  type: 'OSM',
  options: {
    title: 'Open Street Map',
    excludeIdentify: true
  }
}];


export default {
  layers: layers,
  view: view
};
