/* jshint esnext:true */
import ol from 'openlayers';
export default {
  m: {
    //single dimension
    feet: 3.28084,
    miles: 0.000621371,
    //2 dimensions: sq_meters
    acres: 2.47105e-4,
    sq_miles: 3.86102e-7,
    sq_feet: 10.7639,
    sq_km: 1e-6
  },
  km: {
    feet: 3280.84,
    miles: 0.621371
  },
  getPosition: function getPosition(point, srcProj, destUnits) {
    switch (destUnits) {
      case "degrees":
        var lonLat = ol.proj.toLonLat(point.getCoordinates(), srcProj);
        return {
          lon: {
            value: Math.round(lonLat[0] * 10000) / 10000,
            direction: lonLat[0] > 0 ? 'E' : 'W'
          },
          lat: {
            value: Math.round(lonLat[1] * 10000) / 10000,
            direction: lonLat[1] > 0 ? 'N' : 'S'
          }
        };
      default:
        //this does not work
        // var coords = point.getCoordinates();
        // var sourceUnits = srcProj.getUnits();
        // return {
        //   lon: {
        //     value: Math.round(this._convert(coords[0], sourceUnits, destUnits) * 1000) / 1000,
        //     direction: sourceUnits + ' Easting'
        //   }, lat: {
        //     value: Math.round(this._convert(coords[0], sourceUnits, destUnits) * 1000) / 1000,
        //     direction: sourceUnits + ' Northing'
        //   }
        // };
    }
  },
  /*
   * format length output
   * @param {ol.geom.LineString} line
   * @return {float}
   */
  getLength: function getLength(line, sourceProj, destUnits, useGeodisic) {
    //used for transforming measurements to geodisic
    var wgs84Sphere = new ol.Sphere(6378137);
    var length;
    if (useGeodisic !== false) {
      var coordinates = line.getCoordinates();
      length = 0;
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
      }
    } else {
      length = line.getLength();
    }
    var sourceUnits = sourceProj.getUnits();
    if (sourceUnits === destUnits) {
      return length;
    }
    return this._convert(length, sourceUnits, destUnits);
  },
  /*
   * get polygon area
   * @param {ol.geom.Polygon} polygon
   * @param {ol.proj.Projection} srcProj
   * @param {Boolean} useGeodisic - optional, default true
   * @return {string}
   */
  getArea: function getArea(polygon, sourceProj, destUnits, useGeodisic) {
    //used for transforming measurements to geodisic
    var wgs84Sphere = new ol.Sphere(6378137);
    var area;
    if (useGeodisic !== false) {
      var geom = /* @property {ol.geom.Polygon} */ (polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
      var coordinates = geom.getLinearRing(0).getCoordinates();
      area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    } else {
      area = polygon.getArea();
    }
    var sourceUnits = sourceProj.getUnits();
    if (sourceUnits === destUnits) {
      return area;
    }
    return this._convert(area, sourceUnits, destUnits);
  },
  /*
   * converts a number between units
   * @param {float} value
   * @param {string} sourceUnits
   * @param {string} destUnits
   * @return {float}
   */
  _convert: function _convert(value, sourceUnits, destUnits) {
    if (this.hasOwnProperty(sourceUnits) &&
      this[sourceUnits].hasOwnProperty(destUnits)) {
      return Math.round(value * this[sourceUnits][destUnits] * 100) / 100;
    }
    console.warn('Source or destination unit conversion not found.',
      sourceUnits, destUnits);
  }
};
