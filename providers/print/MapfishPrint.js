
import can from 'can';
import Print from './PrintProvider';
import color from 'util/color';

function parseUrl(url) {
  var anchor = document.createElement("a");
  anchor.href = url;
  return anchor;
}

var encoders = {
  OSM: function(layer) {
    var source = layer.getSource();
    var parts = parseUrl(source.getUrls()[0]);
    var split = parts.pathname.split('.');
    var extension = split[split.length - 1];
    return {
      type: 'OSM',
      baseURL: 'http://c.tile.openstreetmap.org',
      extension: extension,
      tileSize: [256, 256],
      maxExtent: layer.getExtent() || [420000, 30000, 900000, 350000],
      resolutions: [156543.03, 78271.52, 39135.76],
    };
  },
  Vector: function(layer) {
    var source = layer.getSource();
    var style = layer.getStyle();
    if (typeof style === 'function') {
      style = style();
    }
    if (style instanceof Array) {
      style = style[0];
    }
    var fillColor = ol.color.asArray(style.getFill().getColor()).slice();

    var fillOpacity;
      fillOpacity = fillColor.length === 4 ? fillColor[3] : 0;
      fillColor = color.rgbToHex(fillColor[0], fillColor[1], fillColor[2]);
    var geoJson = new ol.format.GeoJSON().writeFeaturesObject(source.getFeatures());

    return {
      type: 'vector',
      geoJson: geoJson,
      styles: {
        '': {
          fillColor: fillColor,
          strokeWidth: style.getStroke().getWidth(),
          strokeColor: style.getStroke().getColor(),
          fillOpacity: fillOpacity
        }
      }
    };
  },
  TileWMS: function(layer) {
    var source = layer.getSource();
    var params = source.getParams();
    var layers = params.LAYERS || params.layers;
    var url = parseUrl(source.getUrls()[0]);
    return {
      type: 'WMS',
      layers: layers.split(','),
      baseURL: url.protocol + '//' + url.hostname + url.pathname,
      format: params.FORMAT || params.format || 'image/png'
    };
  },
  ImageWMS: function(layer) {
    return this.TileWMS(layer);
  }
};
/**
 * @constructor providers/print/MapfishPrint MapfishPrint
 * @parent providers/print/PrintProvider
 */
export default Print.extend({
  define: can.extend(Print.prototype.define, {
    /**
     * The url to the mapfish print endpoint
     * @property {String} MapfishPrint.props.url
     * @parent MapfishPrint.props
     */
    url: {
      type: 'string'
    },
    /**
     * Whether or not to include legends. The default is `true`
     * @property {Boolean} MapfishPrint.props.legends
     * @parent MapfishPrint.props
     */
    legends: {
      type: 'boolean',
      value: true
    },
    /**
     * The url to a proxy if required
     * @property {String} MapfishPrint.props.proxy
     * @parent MapfishPrint.props
     */
    proxy: {
      type: 'string',
      value: null
    },
    /**
     * The method to use for printing. The default is `'POST'`
     * @property {String} MapfishPrint.props.method
     * @parent MapfishPrint.props
     */
    method: {
      type: 'string',
      value: 'POST'
    },
    /**
     * The default page printing settings. These settings
     * are heavily dependant on your print service.
     * The default is:
     * ```
     * layout: '8.5x11 Landscape',
     * dpi: 300,
     * mapTitle: 'Map Print'
     * ```
     * @property {Object} MapfishPrint.props.pageDefaults
     * @parent MapfishPrint.props
     */
    pageDefaults: {
      value: {
        layout: '8.5x11 Landscape',
        dpi: 300,
        mapTitle: 'Map Print'
      }
    },
    /**
     * The default print settings to use for the output print task.
     * The default is:
     * ```
     * outputFormat: 'pdf',
     * outputFilename: 'Print.pdf'
     * ```
     * @property {Object} MapfishPrint.props.printDefaults
     * @parent MapfishPrint.props

     */
    printDefaults: {
      value: {
        outputFormat: 'pdf',
        outputFilename: 'Print.pdf'
      }
    },
    /**
     * The default time to wait for the print service to complete
     * before timeout in milliseconds.
     * @property {Number} MapfishPrint.props.maxWait
     * @parent MapfishPrint.props
     */
    maxWait: {
      value: 10000,
      type: 'number'
    }
  }),
  /**
   * @prototype
   */

  /**
   * Loads the print capabilities and returns a promise
   * resolved with the print data
   * @signature
   * @return {Promise} A promise resolved to the print data
   */
  loadCapabilities: function() {
    var self = this;
    this.attr('deferred', can.Deferred());
    var deferred = can.ajax({
      url: this.attr('url') + '/info.json',
      dateType: 'json',
      method: 'GET',
      success: function(capabilities) {
        self.attr(capabilities);
        self.attr('deferred').resolve(capabilities);
      },
      fail: function(error) {
        console.error(error);
      }
    });
    return this.attr('deferred').promise();
  },
  /**
   * Generates a printout and returns a promise
   * which resolves to an object with a `url` and
   * `title` property.
   * @signature
   * @param  {Object} options The print out options.
   * @return {Promise} The promise that resolves to an object with
   * a `url` and `title` property. If the print fails, the `url` will be null, and instead an object with a `title` and `error` property will be returned
   */
  print: function(options) {
    this.attr('deferred', can.Deferred());
    var spec = JSON.stringify(this.getPrintObject(options));
    var url;
    if (this.attr('method') === 'GET') {
      url = this.attr('url') + '?spec=' + encodeURIComponent(spec);

      if (this.attr('proxy')) {
        url = this.attr('proxy') + encodeURIComponent(url);
      }
      this.attr('deferred').resolve({
        url: url,
        title: options.title
      });
      return this.attr('deferred').promise();
    } else {
      url = this.attr('url') + '/create.json';
      if (this.attr('proxy')) {
        url = this.attr('proxy') + encodeURIComponent(url);
      }
      var deferred = can.ajax({
        url: url,
        data: spec,
        contentType: 'application/json',
        type: 'POST',
        success: this.printSuccess.bind(this, options),
        fail: this.printFail.bind(this)
      });
      this.attr('timeout', setTimeout(this.printTimeout.bind(this, deferred), this.attr('maxWait')));
      return this.attr('deferred').promise();
    }
  },
  /**
   * Called internally when the print request returns a response.
   * Since mapfish returns a url with the original server port/path, this function builds a new url using the path to the file and the original print url supplied to the provider.
   * @signature
   * @param  {Object} options The original print options
   * @param  {Object} results The results of the print
   */
  printSuccess: function(options, results) {
    window.clearTimeout(this.attr('timeout'));
    if (!results.getURL) {
      this.printFail({
        responseText: 'No document was generated. A server error occurred.'
      });
      return;
    }
    var splitUrl = results.getURL.split('/');
    var url = this.attr('url') + '/' + splitUrl[splitUrl.length - 1];
    this.attr('deferred').resolve({
      url: url,
      title: options.title
    });
    this.attr('deferred', null);
  },
  /**
   * Called internally when the print request exceeds
   * the maximum amount of wait time. This value is configureable
   * via the `maxWait` parameter.
   * @signature
   * @param  {can.Deferred} def The deferred value that we will
   * manually resolve
   */
  printTimeout: function(def){
    console.log('timeout!');
    if(def){
      def.abort();
    }
    this.printFail({responseText: 'Print timed out'});
  },
  /**
   * Called internally when the print service fails, the maximum
   * wait time is reached, or
   * returns an invalid result.
   * @signature
   * @param  {Object} results The error results. Should contain
   * a `responseText` property
   */
  printFail: function(results) {
    window.clearTimeout(this.attr('timeout'));
    this.attr('deferred').resolve({
      url: null,
      title: 'An error occurred while printing',
      error: results.responseText
    });
    this.attr('deferred', null);
  },
  /**
   * Called internally to create a mapfish compliant print object
   * which can be converted into JSON and sent to the
   * mapfish server.
   * @signature
   * @param  {Object} options An object containing the print parameters (See `print` function)
   * @return {Object} A JSON serializable object that meets
   * the mapfish print spec.
   */
  getPrintObject: function(options) {
    //make sure the selected values are set
    var projection = options.map.getView().getProjection();
    var layers = options.map.getLayers();
    var self = this;
    var printLayers = [];
    layers.forEach(function(layer) {
      if (layer.getVisible()) {
        var lObjects = self.getLayerObjectRecursive(layer);
        if (lObjects.length) {
          printLayers = printLayers.concat(lObjects);
        }
      }
    });
    return can.extend({
      layout: options.layout || this.attr('defaults.layout'),
      layers: printLayers,
      srs: projection.getCode(),
      units: projection.getUnits(),
      pages: [{
        // may be able to calculate the extent based
        // on the layout size of the map?
        // bbox: map.getView().calculateExtent([
        //   layout.attr('map.width'),
        //     layout.attr('map.height'),
        // ]),
        bbox: options.map.getView().calculateExtent(options.map.getSize()),
        // center: map.getView().getCenter(),
        scale: this.getMapScale(options.map),
        mapTitle: options.title,
        dpi: options.dpi
      }]
    }, this.getLegends(options.map));
  },
  /**
   * A helper function to parse layers while flattening group layers
   * @signature
   * @param  {ol.Layer} layer The layer to flatten and parse
   * @return {Object[]} The flattened array of mapfish print ready encoded layer objects
   */
  getLayerObjectRecursive: function(layer) {
    var layerObjects = [];
    if (layer instanceof ol.layer.Group) {
      var self = this;
      layer.getLayers().forEach(function(layer) {
        if (layer.getVisible()) {
          layerObjects = layerObjects.concat(self.getLayerObjectRecursive(layer));
        }
      });
      return layerObjects;
    }
    for (var enc in encoders) {
      if (encoders.hasOwnProperty(enc)) {
        if (layer.getSource() instanceof ol.source[enc]) {
          layerObjects.push(encoders[enc](layer));
          break;
        }
      }
    }
    return layerObjects;
  },
  /**
   * A helper function to convert the map resolution to a scale
   * @signature
   * @param  {ol.Map} map The openlayers map
   * @return {Number} The map scale
   */
  getMapScale: function(map) {
    var resolution = map.getView().getResolution();
    var units = map.getView().getProjection().getUnits();
    var dpi = 25.4 / 0.28;
    var mpu = ol.proj.METERS_PER_UNIT[units];
    var scale = resolution * mpu * 39.37 * dpi;

    return scale;
  },
  /**
   * A helper function to generate urls to the layer legends
   * @signature
   * @param  {ol.Map} map The openlayers map
   * @return {object} An object consisting of the legend urls
   */
  getLegends: function(map) {
    if (!this.attr('legends')) {
      return {};
    }

    var legends = this.getLayerLegendsRecursive(map.getLayers());

    return {
      legends: legends
    };
  },
  /**
   * A helper function to flatten layer groups, create, parse, and return legend objects
   * @signature
   * @param  {ol.Collection} layers The layer collection array
   * @return {legendObject[]} The array of legend objects flattened
   */
  getLayerLegendsRecursive: function(layers) {
    var legends = [];
    var self = this;
    layers.forEach(function(layer) {
      if (!layer.getVisible() || layer.get('excludeLegend')) {
        return;
      }
      if (layer instanceof ol.layer.Group) {
        legends = legends.concat(self.getLayerLegendsRecursive(layer.getLayers()));
        return legends;
      }
      var source = layer.getSource();
      if (source instanceof ol.source.TileWMS ||
        source instanceof ol.source.ImageWMS) {

        var subLayers = source.getParams().LAYERS ||
          source.getParams().layers;
        var legendObject = {
          name: layer.get('title') || subLayers,
          classes: []
        };

        // defaults
        var legendParams = can.extend({
          'SERVICE': 'WMS',
          'REQUEST': 'GetLegendGraphic',
          'WIDTH': 15,
          'HEIGHT': 15,
          'FORMAT': 'image/png'
        }, source.getParams());

        var singlelayers = subLayers.split(',');
        var url = parseUrl(source.getUrls()[0]);
        url = url.protocol + '//' + url.hostname + url.pathname + '?';
        // If a WMS layer doesn't have multiple server layers, only show one graphic
        if (singlelayers.length === 1) {
          legendParams.LAYER = singlelayers[0];
          legendObject.icons = [url + can.param(legendParams)];
        } else {
          for (var i = 0; i < singlelayers.length; i++) {
            legendParams.LAYER = singlelayers[i];
            legendObject.classes.push({
              name: singlelayers[i],
              icons: [url + can.param(legendParams)]
            });
          }
        }
        legends.push(legendObject);
      }
    });
    return legends;
  }
  //the following is taken from the geoext print widget
  //and may be helpful in adding additional functionality to
  //this print provider
  // oldprint: function(options) {
  //
  //   if (!options.layout || !options.dpi) {
  //     throw 'Must provide a layout name and dpi value to print';
  //   }
  //
  //   // this.fire('beforeprint', {
  //   // 	provider: this,
  //   // 	map: this._map
  //   // });
  //
  //   var jsonData = JSON.stringify(L.extend({
  //       units: L.print.Provider.UNITS,
  //       srs: L.print.Provider.SRS,
  //       layout: options.layout,
  //       dpi: options.dpi,
  //       outputFormat: options.outputFormat,
  //       outputFilename: options.outputFilename,
  //       layers: this._encodeLayers(this._map),
  //       pages: [{
  //         center: this._projectCoords(L.print.Provider.SRS, this._map.getCenter()),
  //         scale: this._getScale(),
  //         rotation: options.rotation
  //       }]
  //     }, this.options.customParams, options.customParams, this._makeLegends(this._map))),
  //     url;
  //
  //   if (options.method === 'GET') {
  //     url = this._capabilities.printURL + '?spec=' + encodeURIComponent(jsonData);
  //
  //     if (options.proxy) {
  //       url = options.proxy + encodeURIComponent(url);
  //     }
  //
  //     window.open(url);
  //
  //   } else {
  //     url = this._capabilities.createURL;
  //
  //     if (options.proxy) {
  //       url = options.proxy + url;
  //     }
  //
  //     if (this._xhr) {
  //       this._xhr.abort();
  //     }
  //
  //     this._xhr = $.ajax({
  //       type: 'POST',
  //       contentType: 'application/json; charset=UTF-8',
  //       processData: false,
  //       dataType: 'json',
  //       url: url,
  //       data: jsonData,
  //       success: L.Util.bind(this.onPrintSuccess, this),
  //       error: L.Util.bind(this.onPrintError, this)
  //     });
  //   }
  //
  // },
  //
  // getCapabilities: function() {
  //   return this._capabilities;
  // },
  //
  // _getLayers: function(map) {
  //   var markers = [],
  //     vectors = [],
  //     tiles = [],
  //     imageOverlays = [],
  //     imageNodes,
  //     pathNodes,
  //     id;
  //
  //   for (id in map._layers) {
  //     if (map._layers.hasOwnProperty(id)) {
  //       if (!map._layers.hasOwnProperty(id)) {
  //         continue;
  //       }
  //       var lyr = map._layers[id];
  //
  //       if (lyr instanceof L.TileLayer.WMS || lyr instanceof L.TileLayer) {
  //         tiles.push(lyr);
  //       } else if (lyr instanceof L.ImageOverlay) {
  //         imageOverlays.push(lyr);
  //       } else if (lyr instanceof L.Marker) {
  //         markers.push(lyr);
  //       } else if (lyr instanceof L.Path && lyr.toGeoJSON) {
  //         vectors.push(lyr);
  //       }
  //     }
  //   }
  //   markers.sort(function(a, b) {
  //     return a._icon.style.zIndex - b._icon.style.zIndex;
  //   });
  //
  //   var i;
  //   // Layers with equal zIndexes can cause problems with mapfish print
  //   for (i = 1; i < markers.length; i++) {
  //     if (markers[i]._icon.style.zIndex <= markers[i - 1]._icon.style.zIndex) {
  //       markers[i]._icon.style.zIndex = markers[i - 1].icons.style.zIndex + 1;
  //     }
  //   }
  //
  //   tiles.sort(function(a, b) {
  //     return a._container.style.zIndex - b._container.style.zIndex;
  //   });
  //
  //   // Layers with equal zIndexes can cause problems with mapfish print
  //   for (i = 1; i < tiles.length; i++) {
  //     if (tiles[i]._container.style.zIndex <= tiles[i - 1]._container.style.zIndex) {
  //       tiles[i]._container.style.zIndex = tiles[i - 1]._container.style.zIndex + 1;
  //     }
  //   }
  //
  //   imageNodes = [].slice.call(this, map._panes.overlayPane.childNodes);
  //   imageOverlays.sort(function(a, b) {
  //     return imageNodes.indexOf(a._image) - imageNodes.indexOf(b._image);
  //   });
  //
  //   if (map._pathRoot) {
  //     pathNodes = [].slice.call(this, map._pathRoot.childNodes);
  //     vectors.sort(function(a, b) {
  //       return pathNodes.indexOf(a._container) - pathNodes.indexOf(b._container);
  //     });
  //   }
  //
  //   return tiles.concat(vectors).concat(imageOverlays).concat(markers);
  // },
  //
  // _getScale: function() {
  //   var map = this._map,
  //     bounds = map.getBounds(),
  //     inchesKm = L.print.Provider.INCHES_PER_METER * 1000,
  //     scales = this._capabilities.scales,
  //     sw = bounds.getSouthWest(),
  //     ne = bounds.getNorthEast(),
  //     halfLat = (sw.lat + ne.lat) / 2,
  //     midLeft = L.latLng(halfLat, sw.lng),
  //     midRight = L.latLng(halfLat, ne.lng),
  //     mwidth = midLeft.distanceTo(midRight),
  //     pxwidth = map.getSize().x,
  //     kmPx = mwidth / pxwidth / 1000,
  //     mscale = (kmPx || 0.000001) * inchesKm * L.print.Provider.DPI,
  //     closest = Number.POSITIVE_INFINITY,
  //     i = scales.length,
  //     diff,
  //     scale;
  //
  //   while (i--) {
  //     diff = Math.abs(mscale - Number(scales[i].value));
  //     if (diff < closest) {
  //       closest = diff;
  //       scale = parseInt(Number(scales[i].value), 10);
  //     }
  //   }
  //   return scale;
  // },
  //
  // _getLayoutByName: function(name) {
  //   var layout, i, l;
  //
  //   for (i = 0, l = this._capabilities.layouts.length; i < l; i++) {
  //     if (this._capabilities.layouts[i].name === name) {
  //       layout = this._capabilities.layouts[i];
  //       break;
  //     }
  //   }
  //   return layout;
  // },
  //
  // _encodeLayers: function(map) {
  //   var enc = [],
  //     vectors = [],
  //     layer,
  //     i;
  //
  //   var layers = this._getLayers(map);
  //   for (i = 0; i < layers.length; i++) {
  //     layer = layers[i];
  //     if (layer instanceof L.TileLayer.WMS) {
  //       enc.push(this._encoders.layers.tilelayerwms.call(this, layer));
  //     } else if (L.mapbox && layer instanceof L.mapbox.TileLayer) {
  //       enc.push(this._encoders.layers.tilelayermapbox.call(this, layer));
  //     } else if (layer instanceof L.TileLayer) {
  //       enc.push(this._encoders.layers.tilelayer.call(this, layer));
  //     } else if (layer instanceof L.ImageOverlay) {
  //       enc.push(this._encoders.layers.image.call(this, layer));
  //     } else if (layer instanceof L.Marker || (layer instanceof L.Path && layer.toGeoJSON)) {
  //       vectors.push(layer);
  //     }
  //   }
  //   if (vectors.length) {
  //     enc.push(this._encoders.layers.vector.call(this, vectors));
  //   }
  //   return enc;
  // },
  //
  // _makeLegends: function(map, options) {
  //   if (!this.options.legends) {
  //     return [];
  //   }
  //
  //   var legends = [],
  //     legendReq, singlelayers, url, i;
  //
  //   var layers = this._getLayers(map);
  //   var layer, oneLegend;
  //   for (i = 0; i < layers.length; i++) {
  //     layer = layers[i];
  //     if (layer instanceof L.TileLayer.WMS) {
  //
  //       oneLegend = {
  //         name: layer.options.title || layer.wmsParams.layers,
  //         classes: []
  //       };
  //
  //       // defaults
  //       legendReq = {
  //         'SERVICE': 'WMS',
  //         'LAYER': layer.wmsParams.layers,
  //         'REQUEST': 'GetLegendGraphic',
  //         'VERSION': layer.wmsParams.version,
  //         'FORMAT': layer.wmsParams.format,
  //         'STYLE': layer.wmsParams.styles,
  //         'WIDTH': 15,
  //         'HEIGHT': 15
  //       };
  //
  //       legendReq = L.extend(legendReq, options);
  //       url = L.Util.template(layer._url);
  //
  //       singlelayers = layer.wmsParams.layers.split(',');
  //
  //       // If a WMS layer doesn't have multiple server layers, only show one graphic
  //       if (singlelayers.length === 1) {
  //         oneLegend.icons = [this._getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))];
  //       } else {
  //         for (i = 0; i < singlelayers.length; i++) {
  //           legendReq.LAYER = singlelayers[i];
  //           oneLegend.classes.push({
  //             name: singlelayers[i],
  //             icons: [this._getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))]
  //           });
  //         }
  //       }
  //
  //       legends.push(oneLegend);
  //     }
  //   }
  //
  //   return {
  //     legends: legends
  //   };
  // },
  //
  // _encoders: {
  //   layers: {
  //     httprequest: function(layer) {
  //       var baseUrl = layer._url;
  //
  //       if (baseUrl.indexOf('{s}') !== -1) {
  //         baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
  //       }
  //       baseUrl = this._getAbsoluteUrl(baseUrl);
  //
  //       return {
  //         baseURL: baseUrl,
  //         opacity: layer.options.opacity
  //       };
  //     },
  //     tilelayer: function(layer) {
  //       var enc = this._encoders.layers.httprequest.call(this, layer),
  //         baseUrl = layer._url.substring(0, layer._url.indexOf('{z}')),
  //         resolutions = [],
  //         zoom;
  //
  //       // If using multiple subdomains, replace the subdomain placeholder
  //       if (baseUrl.indexOf('{s}') !== -1) {
  //         baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
  //       }
  //
  //       for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
  //         resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
  //       }
  //
  //       return L.extend(enc, {
  //         // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
  //         // See https://github.com/mapfish/mapfish-print/pull/38
  //         type: 'OSM',
  //         baseURL: baseUrl,
  //         extension: 'png',
  //         tileSize: [layer.options.tileSize, layer.options.tileSize],
  //         maxExtent: L.print.Provider.MAX_EXTENT,
  //         resolutions: resolutions,
  //         singleTile: false
  //       });
  //     },
  //     tilelayerwms: function(layer) {
  //       var enc = this._encoders.layers.httprequest.call(this, layer),
  //         layerOpts = layer.options,
  //         p;
  //
  //       L.extend(enc, {
  //         type: 'WMS',
  //         layers: [layerOpts.layers].join(',').split(',').filter(function(x) {
  //           return x !== "";
  //         }), //filter out empty strings from the array
  //         format: layerOpts.format,
  //         styles: [layerOpts.styles].join(',').split(',').filter(function(x) {
  //           return x !== "";
  //         }),
  //         singleTile: true
  //       });
  //
  //       for (p in layer.wmsParams) {
  //         if (layer.wmsParams.hasOwnProperty(p)) {
  //           if ('detectretina,format,height,layers,request,service,srs,styles,version,width'.indexOf(p.toLowerCase()) === -1) {
  //             if (!enc.customParams) {
  //               enc.customParams = {};
  //             }
  //             enc.customParams[p] = layer.wmsParams[p];
  //           }
  //         }
  //       }
  //       return enc;
  //     },
  //     tilelayermapbox: function(layer) {
  //       var resolutions = [],
  //         zoom;
  //
  //       for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
  //         resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
  //       }
  //
  //       var customParams = {};
  //       if (typeof layer.options.access_token === 'string' && layer.options.access_token.length > 0) {
  //         customParams.access_token = layer.options.access_token;
  //       }
  //
  //       return {
  //         // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
  //         // See https://github.com/mapfish/mapfish-print/pull/38
  //         type: 'OSM',
  //         baseURL: layer.options.tiles[0].substring(0, layer.options.tiles[0].indexOf('{z}')),
  //         opacity: layer.options.opacity,
  //         extension: 'png',
  //         tileSize: [layer.options.tileSize, layer.options.tileSize],
  //         maxExtent: L.print.Provider.MAX_EXTENT,
  //         resolutions: resolutions,
  //         singleTile: false,
  //         customParams: customParams
  //       };
  //     },
  //     image: function(layer) {
  //       return {
  //         type: 'Image',
  //         opacity: layer.options.opacity,
  //         name: 'image',
  //         baseURL: this._getAbsoluteUrl(layer._url),
  //         extent: this._projectBounds(L.print.Provider.SRS, layer._bounds)
  //       };
  //     },
  //     vector: function(features) {
  //       var encFeatures = [],
  //         encStyles = {},
  //         opacity,
  //         feature,
  //         style,
  //         dictKey,
  //         dictItem = {},
  //         styleDict = {},
  //         styleName,
  //         nextId = 1,
  //         featureGeoJson,
  //         i, l;
  //
  //       for (i = 0, l = features.length; i < l; i++) {
  //         feature = features[i];
  //
  //         if (feature instanceof L.Marker) {
  //           var icon = feature.options.icon,
  //             iconUrl = icon.options.iconUrl || L.Icon.Default.imagePath + '/marker-icon.png',
  //             iconSize = L.Util.isArray(icon.options.iconSize) ? new L.Point(icon.options.iconSize[0], icon.options.iconSize[1]) : icon.options.iconSize,
  //             iconAnchor = L.Util.isArray(icon.options.iconAnchor) ? new L.Point(icon.options.iconAnchor[0], icon.options.iconAnchor[1]) : icon.options.iconAnchor,
  //             scaleFactor = (this.options.dpi / L.print.Provider.DPI);
  //
  //           style = {
  //             externalGraphic: this._getAbsoluteUrl(iconUrl),
  //             graphicWidth: (iconSize.x / scaleFactor),
  //             graphicHeight: (iconSize.y / scaleFactor),
  //             graphicXOffset: (-iconAnchor.x / scaleFactor),
  //             graphicYOffset: (-iconAnchor.y / scaleFactor)
  //           };
  //         } else {
  //           style = this._extractFeatureStyle(feature);
  //         }
  //
  //         dictKey = JSON.stringify(style);
  //         dictItem = styleDict[dictKey];
  //         if (dictItem) {
  //           styleName = dictItem;
  //         } else {
  //           styleDict[dictKey] = styleName = nextId++;
  //           encStyles[styleName] = style;
  //         }
  //
  //         featureGeoJson = (feature instanceof L.Circle) ? this._circleGeoJSON(feature) : feature.toGeoJSON();
  //         featureGeoJson.geometry.coordinates = this._projectCoords(L.print.Provider.SRS, featureGeoJson.geometry.coordinates);
  //         featureGeoJson.properties._leaflet_style = styleName;
  //
  //         // All markers will use the same opacity as the first marker found
  //         if (opacity === null) {
  //           opacity = feature.options.opacity || 1.0;
  //         }
  //
  //         encFeatures.push(featureGeoJson);
  //       }
  //
  //       return {
  //         type: 'Vector',
  //         styles: encStyles,
  //         opacity: opacity,
  //         styleProperty: '_leaflet_style',
  //         geoJson: {
  //           type: 'FeatureCollection',
  //           features: encFeatures
  //         }
  //       };
  //     }
  //   }
  // },
  //
  // _circleGeoJSON: function(circle) {
  //   var projection = circle._map.options.crs.projection;
  //   var earthRadius = 1,
  //     i;
  //
  //   if (projection === L.Projection.SphericalMercator) {
  //     earthRadius = 6378137;
  //   } else if (projection === L.Projection.Mercator) {
  //     earthRadius = projection.R_MAJOR;
  //   }
  //   var cnt = projection.project(circle.getLatLng());
  //   var scale = 1.0 / Math.cos(circle.getLatLng().lat * Math.PI / 180.0);
  //   var points = [];
  //   for (i = 0; i < 64; i++) {
  //     var radian = i * 2.0 * Math.PI / 64.0;
  //     var shift = L.point(Math.cos(radian), Math.sin(radian));
  //     points.push(projection.unproject(cnt.add(shift.multiplyBy(circle.getRadius() * scale / earthRadius))));
  //   }
  //   return L.polygon(points).toGeoJSON();
  // },
  //
  // _extractFeatureStyle: function(feature) {
  //   var options = feature.options;
  //
  //   return {
  //     stroke: options.stroke,
  //     strokeColor: options.color,
  //     strokeWidth: options.weight,
  //     strokeOpacity: options.opacity,
  //     strokeLinecap: 'round',
  //     fill: options.fill,
  //     fillColor: options.fillColor || options.color,
  //     fillOpacity: options.fillOpacity
  //   };
  // },
  //
  // _getAbsoluteUrl: function(url) {
  //   var a;
  //
  //   if (L.Browser.ie) {
  //     a = document.createElement('a');
  //     a.style.display = 'none';
  //     document.body.appendChild(a);
  //     a.href = url;
  //     document.body.removeChild(a);
  //   } else {
  //     a = document.createElement('a');
  //     a.href = url;
  //   }
  //   return a.href;
  // },
  //
  // _projectBounds: function(crs, bounds) {
  //   var sw = bounds.getSouthWest(),
  //     ne = bounds.getNorthEast();
  //
  //   return this._projectCoords(crs, sw).concat(this._projectCoords(crs, ne));
  // },
  //
  // _projectCoords: function(crs, coords) {
  //   var crsKey = crs.toUpperCase().replace(':', ''),
  //     crsClass = L.CRS[crsKey];
  //
  //   if (!crsClass) {
  //     throw 'Unsupported coordinate reference system: ' + crs;
  //   }
  //
  //   return this._project(crsClass, coords);
  // },
  //
  // _project: function(crsClass, coords) {
  //   var projected,
  //     pt,
  //     i, l;
  //
  //   if (typeof coords[0] === 'number') {
  //     coords = new L.LatLng(coords[1], coords[0]);
  //   }
  //
  //   if (coords instanceof L.LatLng) {
  //     pt = crsClass.project(coords);
  //     return [pt.x, pt.y];
  //   } else {
  //     projected = [];
  //     for (i = 0, l = coords.length; i < l; i++) {
  //       projected.push(this._project(crsClass, coords[i]));
  //     }
  //     return projected;
  //   }
  // },
  //
  // // --------------------------------------------------
  // // Event handlers
  // // --------------------------------------------------
  //
  // onCapabilitiesLoad: function(response) {
  //   this._capabilities = response;
  //
  //   if (!this.options.layout) {
  //     this.options.layout = this._capabilities.layouts[0].name;
  //   }
  //
  //   if (!this.options.dpi) {
  //     this.options.dpi = this._capabilities.dpis[0].value;
  //   }
  //
  //   this.fire('capabilitiesload', {
  //     provider: this,
  //     capabilities: this._capabilities
  //   });
  // },
  //
  // onPrintSuccess: function(response) {
  //   var url = response.getURL + (L.Browser.ie ? '?inline=true' : '');
  //
  //   if (this.options.autoOpen) {
  //     if (L.Browser.ie) {
  //       window.open(url);
  //     } else {
  //       window.location.href = url;
  //     }
  //   }
  //
  //   this._xhr = null;
  //
  //   this.fire('print', {
  //     provider: this,
  //     response: response
  //   });
  // },
  //
  // onPrintError: function(jqXHR) {
  //   this._xhr = null;
  //
  //   this.fire('printexception', {
  //     provider: this,
  //     response: jqXHR
  //   });
  // }
});
