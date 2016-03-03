<!--
@page printing Printing With Mapfish
@parent guides
-->

This document documents the steps taken setting up a working mapfish extension on Geoserver.

## Mapfish/Geoserver config
Mapfish uses a `config.yaml` file to control each print setting such as layout,
dpi, and available scales.

Here is a sample geoserver mapfish config file.

`geoserver/data_dir/printing/config.yaml`

```yaml
---
dpis:
    - 300
    - 500

formats:
    - pdf
    - png

scales:
    - 70.53107625
    - 141.0621525
    - 282.124305
    - 564.24861
    - 1128.497220
    - 2256.994440
    - 4513.988880
    - 9027.977761
    - 18055.955520
    - 36111.911040
    - 72223.822090
    - 144447.644200
    - 288895.288400
    - 577790.576700
    - 1155581.153000
    - 2311162.307000
    - 4622324.614000
    - 9244649.227000
    - 18489298.450000
    - 36978596.910000
    - 73957193.820000
    - 147914387.600000
    - 295828775.300000
    - 591657550.500000

hosts:
    - !ipMatch
      ip: c.tile.openstreetmap.org
    - !ipMatch
      ip: demo.opengeo.org
    - !ipMatch
      ip: giswebservices.massgis.state.ma.us
    - !localMatch
      dummy: true

layouts:
   letter_landscape:
      pageSize: Letter
      mainPage:
         items:
            - !text
               text: '${mapTitle}'

            - !map
               width: 500
               height: 700

            - !legends
               maxWidth: 500
               maxHeight: 200
```

## Mapfish Print Endpoint
url: http://localhost/geoserver/pdf/info.json

This returns a response text like so:
```json
{
    "scales": [
        {
            "name": "1:2,500",
            "value": "2500.0"
        },
        {
            "name": "1:5,000",
            "value": "5000.0"
        },
        {
            "name": "1:10,000",
            "value": "10000.0"
        },
        {
            "name": "1:25,000",
            "value": "25000.0"
        },
        {
            "name": "1:50,000",
            "value": "50000.0"
        }
    ],
    "dpis": [
        {
            "name": "127",
            "value": "127"
        },
        {
            "name": "190",
            "value": "190"
        },
        {
            "name": "254",
            "value": "254"
        }
    ],
    "outputFormats": [
        {
            "name": "png"
        },
        {
            "name": "pdf"
        }
    ],
    "layouts": [
        {
            "name": "letter_landscape",
            "map": {
                "width": 500,
                "height": 700
            },
            "rotation": false
        }
    ],
    "printURL": "http://localhost:8080/geoserver/pdf/print.pdf",
    "createURL": "http://localhost:8080/geoserver/pdf/create.json"
}
```

In order to print, a POST body must be sent like the following to the `createURL`.
```javascript
{
    layout: 'letter_landscape',
    srs: 'EPSG:3857',
    units: 'm',
    layers: [{
        type: 'OSM',
        baseURL: 'http://c.tile.openstreetmap.org',
        maxExtent: [420000, 30000, 900000, 350000],
        tileSize: [256, 265],
        extension: 'png',
        resolutions: [156543.03, 78271.52, 39135.76]
      }
    ],
    pages: [
        {
          bbox: [-10389200, 5503701.999999999,-10378669, 5522001.499999998],
            scale: 5000,
            dpi: 190,
          mapTitle: "my Map Title"
        }
    ]
}
```

## Additional Resources
* [Geoserver Plugin](http://docs.geoserver.org/latest/en/user/extensions/printing/index.html#installation)
* [Mapfish Configuration](http://www.mapfish.org/doc/print/)
