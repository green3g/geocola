
//import the css used in this app and config items for optimized build
import 'node_modules/openlayers/dist/ol.css!';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap/dist/css/bootstrap-theme.min.css!';
import 'font-awesome/css/font-awesome.min.css';
import './styles.less!';

import 'bootstrap/dist/js/bootstrap.min';

//import components used by this app
//TODO: these may be converted into <can-import> tags eventually
import 'can-geo/measure-widget/measure-widget';
import 'can-geo/ol-map/ol-map';
import 'can-geo/identify-widget/identify-widget';
import 'can-geo/ol-popup/ol-popup';
import 'can-geo/locator-widget/locator-widget';
import 'can-geo/print-widget/print-widget';
import 'can-geo/layer-control/layer-control';
import 'can-geo/layer-control/layer-components/Default';
import 'can-geo/layer-control/layer-components/Group';
import 'can-geo/layer-control/layer-components/TileWMS';
import 'can-ui/panel-container/panel-container';
import 'can-ui/tab-container/tab-container';
import 'can-crud/crud-manager/crud-manager';
