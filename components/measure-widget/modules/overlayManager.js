/*jshint esnext: true*/
import can from 'can';
import ol from 'openlayers';
import conversion from './conversion';
import helpOverlayTemplate from './helpOverlay.stache!';
import measureOverlayTemplate from './measureOverlay.stache!';
import widgetModel from 'components/widget-model';

export default widgetModel.extend({
  helpMessage: null,
  useGeodisic: true,
  init: function() {
    widgetModel.prototype.init.call(this, arguments);
    this.attr('measureOverlays', []);
    this.initVectorLayer();
    this.initHelpOverlay();
    this.initMeasureOverlay();
  },
  initVectorLayer: function() {
    var vectorSource = new ol.source.Vector();
    this.attr('vectorLayer', new ol.layer.Vector({
      title: 'Measurements',
      id: 'measure' + this.attr('instanceId'),
      source: vectorSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(14,138,231, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0e8ae7',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#0e8ae7'
          })
        })
      })
    }));
    this.attr('map').addLayer(this.attr('vectorLayer'));
  },
  activate: function(measure) {
    this.attr('activeMeasurement', measure);
    if (this.attr('interaction')) {
      this.attr('map').removeInteraction(this.attr('interaction'));
    }
    //add the help tooltip listener
    this.addMapHover();
    //add the interaction for measuring
    this.attr('interaction', this.getInteraction(measure.type));
    this.attr('map').addInteraction(this.attr('interaction'));
  },
  deactivate: function() {
    this.removeMapHover();
    if (this.attr('interaction')) {
      this.attr('map').removeInteraction(this.attr('interaction'));
      this.attr('interaction', null);
    }
  },
  changeUnits: function(key) {
    var self = this;
    this.attr('activeMeasurement.units').forEach(function(unit) {
      if (unit.value === key) {
        self.attr('activeUnits', unit);
      }
    });
  },
  addMapHover: function() {
    if (!this.attr('pointerMoveKey')) {
      this.attr('pointerMoveKey', this.attr('map').on('pointermove', this.pointerMove.bind(this)));
    }
  },
  removeMapHover: function() {
    if (this.attr('pointerMoveKey')) {
      this.attr('map').unByKey(this.attr('pointerMoveKey'));
      this.attr('pointerMoveKey', null);
    }
    this.attr('helpOverlay').setPosition(undefined);
  },
  getInteraction: function(type) {
    var interaction = new ol.interaction.Draw({
      source: this.attr('vectorLayer').getSource(),
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
    interaction.on('drawstart', this.drawStart.bind(this));
    interaction.on('drawend', this.drawEnd.bind(this));
    return interaction;
  },
  initHelpOverlay: function() {
    var node = this.attr('map').getViewport();
    var frag = can.view(helpOverlayTemplate, this);
    var helpNode = node.appendChild(frag.firstChild);
    this.attr('helpOverlay', new ol.Overlay({
      element: helpNode,
      offset: [15, 0],
      positioning: 'center-left'
    }));
    this.attr('map').addOverlay(this.attr('helpOverlay'));
  },
  initMeasureOverlay: function() {
    this.attr('measureOverlay', this.createMeasureOverlay(this));
    this.attr('map').addOverlay(this.attr('measureOverlay'));
  },
  createMeasureOverlay: function(attributes) {
    var node = this.attr('map').getViewport();
    var frag = can.view(measureOverlayTemplate, attributes);
    var measureNode = node.appendChild(frag.firstChild);

    return new ol.Overlay({
      element: measureNode,
      offset: [-15, 0],
      positioning: 'bottom-center'
    });
  },
  clearMeasureOverlays: function() {
    var self = this;
    this.attr('measureOverlays').forEach(function(o) {
      var element = o.getElement();
      self.attr('map').removeOverlay(o);
      element.parentNode.removeChild(element);
    });
    this.attr('measureOverlays').replace([]);
    this.attr('vectorLayer').getSource().clear();
  },
  pointerMove: function(evt) {
    if (evt.dragging) {
      return;
    }
    this.attr('helpOverlay').setPosition(evt.coordinate);
  },
  drawStart: function(evt) {
    var self = this;
    evt.feature.set('name', 'Measurement');
    var geom = evt.feature.getGeometry();
    if (geom instanceof ol.geom.Point) {
      this.attr('measureOverlay').setPosition(geom.getLastCoordinate());
      this.attr('measureValue', conversion.getPosition(geom,
        this.attr('map').getView().getProjection(),
        this.attr('activeUnits.value')));
      this.drawEnd(evt);
      return;
    }
    var coords = evt.coordinate,
      value;
    geom.on('change', function(evt) {
      var geom = evt.target;
      if (geom instanceof ol.geom.Polygon) {
        coords = geom.getInteriorPoint().getCoordinates();
        value = conversion.getArea(geom, self.attr('map').getView().getProjection(),
          self.attr('activeUnits.value'), self.attr('useGeodisic'));
      } else if (geom instanceof ol.geom.LineString) {
        coords = geom.getLastCoordinate();
        value = conversion.getLength(geom, self.attr('map').getView().getProjection(),
          self.attr('activeUnits.value'), self.attr('useGeodisic'));
      }
      self.attr('measureOverlay').setPosition(coords);
      self.attr('measureValue', value);
    });
  },
  drawEnd: function(evt) {
    var coords = this.attr('measureOverlay').getPosition();
    this.attr('measureOverlay').setPosition(undefined);
    if (this.attr('addLabels')) {
      var tooltip = this.createMeasureOverlay({
        activeUnits: can.extend({}, this.attr('activeUnits')),
        measureValue: this.attr('measureValue'),
        cssClass: ' measure-tooltip-static'
      });
      tooltip.setOffset([0, -7]);
      this.attr('map').addOverlay(tooltip);
      tooltip.setPosition(coords);
      this.attr('measureOverlays').push(tooltip);
    }
  }
});
