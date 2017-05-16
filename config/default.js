import Esri from 'can-geo/providers/location/EsriGeocoder';
import Mapfish from 'can-geo/providers/print/MapfishPrint';
import ol from 'openlayers';

export const config = {

  // a address search provider, the default uses esri's world geocoder
  // for suggestsions and results
    search: new Esri({
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    }),

  // a print provider
  // this is currently set up to use a geoserver hosted locally, so it won't
  // work without setting that up
    print: new Mapfish({
        url: 'http://localhost/geoserver/pdf'
    }),

  // map coordinates
  // the default coordinate system is latitude/longitude
    x: -84,
    y: 49,
    zoom: 6,

  // map options like layers and view options
    mapOptions: {

    // The main property in mapOptions is probably layers.
    // each layer is a simplified object that will be used
    // to create openlayers layers.
        layers: [{
            type: 'TileWMS',
            options: {
                title: 'OSM WMS Layers',
                visible: false
            },
            sourceOptions: {
                url: 'http://demo.opengeo.org/geoserver/osm/wms',
                params: {
                    'LAYERS': 'osm:buildings,osm:water_areas,osm:landuse_overlay,osm:landcover',
                    'TILED': true
                },
                serverType: 'geoserver'
            }
        }, {
            type: 'TileWMS',
            options: {
                title: 'USA Layer'
            },
            sourceOptions: {
                url: 'http://demo.opengeo.org/geoserver/wms',
                params: {
                    'LAYERS': 'topp:states',
                    'TILED': true
                },
                serverType: 'geoserver'
            }
        }, {
            type: 'TileWMS',
            extent: [-13884991, 2870341, -7455066, 6338219],
            sourceOptions: {
                url: 'http://localhost:8080/geoserver/wms',
                params: {
                    'LAYERS': 'tiger:poly_landmarks,tiger:tiger_roads,tiger:poi',
                    'TILED': true
                },
                serverType: 'geoserver'
            }
        }, {
      // make a basemap style group
            type: 'Group',
            radioGroup: true,
            options: {
                title: 'Basemaps',
                radioGroup: true,
                layers: [{
                    type: 'OSM',
                    options: {
                        title: 'Open Street Map'
                    }
                },
          //we can include layer objects too,
                    new ol.layer.Tile({
                        id: 'esri',
                        title: 'Esri Basemap',
                        source: new ol.source.XYZ({
                            attributions: [
                              'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
                          ],
                            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Bing',
                        id: 'bing',
                        visible: false,
                        preload: Infinity,
                        source: new ol.source.BingMaps({
                            key: 'AmdC5WlU6y4LauEDIekM6IIgfGL5zTgBLhhTdwVMFw5vCv1Z13qzRWaeV4arnBGd',
                            imagerySet: 'AerialWithLabels',
              // use maxZoom 19 to see stretched tiles instead of the BingMaps
              // "no photos at this zoom level" tiles
                            maxZoom: 19
                        })
                    })
                ]
            }
        }]
    }
};
