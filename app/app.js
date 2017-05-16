import 'can-geo/ol-map/ol-map';
import ol from 'openlayers';
import 'font-awesome/css/font-awesome.css';
import 'spectre.css/dist/spectre.css';
import './app.less';

import 'can-geo/layer-control/layer-control';
import 'can-geo/layer-control/layer-components/Default';
import 'can-geo/layer-control/layer-components/TileWMS';
import 'can-geo/layer-control/layer-components/Group';

import 'can-geo/search-widget/search-widget';
import 'can-geo/print-widget/print-widget';
import 'can-geo/measure-widget/measure-widget';
import 'can-geo/ol-popup/ol-popup';
import 'can-geo/identify-widget/identify-popup';
import '../sidebar-nav/sidebar-nav';
import DefineMap from 'can-define/map/map';
import renderer from './app.stache';

export const AppViewModel = DefineMap.extend('App', {
    seal: false
}, {
    mapOptions: '*',
    click: {
        type: 'string',
        value: 'identify',
        set (click) {
            return click;
        }
    },
    map: {
        value: null
    },
    setMapClick (click) {
        this.click = click;
    },
    startup (domNode) {
        domNode = typeof domNode === 'string' ? document.querySelector(domNode) : domNode;
        domNode.appendChild(renderer(this));
        const div = document.body.querySelector('.ol-map-container');
        div.classList.add('sidebar-map');
    }
});
