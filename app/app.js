import 'can-geo/ol-map/ol-map';
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
import DefineList from 'can-define/list/list';
import renderer from './app.stache';
import callbacks from 'can-view-callbacks';
import stache from 'can-stache';
import canViewModel from 'can-view-model';
import assign from 'can-util/js/assign/assign';


callbacks.attr('options', function (el, attrData) {
    var scopeRead = el.getAttribute(attrData.attributeName);
    assign(canViewModel(el), attrData.scope.get(scopeRead));
});

export const WidgetConfigMap = DefineMap.extend('WidgetConfig', {
    icon: 'string',
    tooltip: 'string',
    position: {
        type: 'string',
        value: 'left'
    },
    tag: {
        set (tag) {
            this.template = `<${tag} {parameters}="parameters" {map}="map" />`;
            return tag;
        }
    },
    template: {
        type (val) {
            if (typeof val === 'string') {
                return stache(val);
            }
            return val;
        }
    },
    parameters: DefineMap
});

export const WidgetConfigList = DefineList.extend({
    '#': WidgetConfigMap
});

export const AppViewModel = DefineMap.extend('App', {
    seal: false
}, {
    mapOptions: '*',
    widgets: WidgetConfigList,
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
