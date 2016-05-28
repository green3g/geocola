
//import the css used in this app and config items for optimized build
import 'node_modules/openlayers/dist/ol.css!';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap/dist/css/bootstrap-theme.min.css!';
import 'font-awesome/css/font-awesome.min.css';
import './css/viewer.css!';

import 'bootstrap/dist/js/bootstrap.min';

//import components used by this app
//TODO: these may be converted into <can-import> tags eventually
import '../../measure-widget/measure-widget';
import '../../ol-map/ol-map';
import '../../panel-container/panel-container';
import '../../tab-container/tab-container';
import '../../identify-widget/identify-widget';
import '../../ol-popup/ol-popup';
import '../../locator-widget/locator-widget';
import '../../print-widget/print-widget';
import '../../layer-control/layer-control';
import '../../crud-manager/crud-manager';
import '../../layer-control/layer-components/Default';
import '../../layer-control/layer-components/Group';
import '../../layer--control/layer-components/TileWMS';
