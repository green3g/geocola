import Esri from 'can-geo/providers/location/EsriGeocoder';
import Mapfish from 'can-geo/providers/print/MapfishPrint';
import ol from 'openlayers';

export const config = {
    search: new Esri({
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
    }),
    print: new Mapfish({
        url: 'http://localhost/geoserver/pdf'
    }),
    mapOptions: {
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
                params: {'LAYERS': 'topp:states', 'TILED': true},
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
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'],
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
                            key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF',
                            imagerySet: 'AerialWithLabels',
                      // use maxZoom 19 to see stretched tiles instead of the BingMaps
                      // "no photos at this zoom level" tiles
                            maxZoom: 19
                        })
                    })]
            }
        }]
    }
};
