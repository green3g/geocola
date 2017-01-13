import 'can-geo/ol-map/ol-map';
import ol from 'openlayers';
import 'sidebar-v2/js/ol3-sidebar';
import 'sidebar-v2/css/ol3-sidebar.css';
import 'font-awesome/css/font-awesome.css';
import 'spectre.css/dist/spectre.css';
import './app.less';

import 'can-geo/layer-control/layer-control';
import 'can-geo/layer-control/layer-components/Default';
import 'can-geo/layer-control/layer-components/TileWMS';
import 'can-geo/layer-control/layer-components/Group';

import 'can-geo/locator-widget/';
import 'can-geo/print-widget/print-widget';
import 'can-geo/measure-widget/measure-widget';
import 'can-geo/ol-popup/ol-popup';
import 'can-geo/identify-widget/identify-widget';

import DefineMap from 'can-define/map/map';
import renderer from './app.stache';

export const AppViewModel = DefineMap.extend('App', {
    mapOptions: '*',
    click: {
        type: 'string',
        value: 'identify',
        set (click) {
            return click;
        }
    },
    map: {
        value: null,
        set (map) {
            if (map) {
                map.addControl(new ol.control.Sidebar({
                    element: 'sidebar'
                }));
            }
            return map;
        }
    },
    startup (domNode) {
        domNode = typeof domNode === 'string' ? document.querySelector(domNode) : domNode;
        domNode.appendChild(renderer(this));
        const div = document.body.querySelector('.ol-map-container');
        div.classList.add('sidebar-map');
    }
});
