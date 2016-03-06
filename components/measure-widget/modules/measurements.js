/*jshint esnext: true */
export default [{
  type: 'Point', //@property {ol.geom.GeometryType}
  label: 'Measure Point',
  iconClass: 'fa fa-crosshairs',
  helpMessage: 'Click to draw a point',
  units: [{
    label: 'Degrees',
    selected: true,
    value: 'degrees'
  }]
}, {
  type: 'LineString',
  label: 'Measure Line',
  iconClass: 'fa fa-arrows-h',
  helpMessage: 'Click to continue drawing the line',
  units: [{
    label: 'Feet',
    selected: true,
    value: 'feet'
  }, {
    label: 'Miles',
    value: 'miles'
  }]
}, {
  type: 'Polygon',
  label: 'Measure Polygon',
  iconClass: 'fa fa-square-o',
  helpMessage: 'Click to continue drawing the polygon',
  units: [{
    label: 'Sq. Miles',
    value: 'sq_miles',
    selected: true
  }, {
    label: 'Acres',
    value: 'acres'
  }, {
    label: 'Sq. Feet',
    value: 'sq_feet'
  }, {
    label: 'Sq. km',
    value: 'sq_km'
  }]
}];
