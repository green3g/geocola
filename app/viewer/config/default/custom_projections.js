/*jshint esnext: true */
import proj4 from 'proj4';
import ol from 'openlayers';

//add custom projections for the MA demo data
proj4.defs('EPSG:26986', '+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs');
proj4.defs('urn:ogc:def:crs:EPSG::26986', proj4.defs['EPSG:26986']);
var mass_proj = new ol.proj.Projection({
  code: 'urn:ogc:def:crs:EPSG::26986',
  extent: [31789.1658, 790194.4183, 337250.8970, 961865.1338],
  units: 'm'
});
ol.proj.addProjection(mass_proj);

ol.proj.addCoordinateTransforms(
  mass_proj, 'EPSG:3857',
  function forward(coords) {
    return proj4(
      proj4.defs['EPSG:26986'], proj4.defs['EPSG:3857'],
      coords);
  },
  function inverse(coords) {
    return proj4(
      proj4.defs['EPSG:3857'], proj4.defs['EPSG:26986'],
      coords);
  });
