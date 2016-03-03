/*jshint esnext:true*/

//import the css used in this app and config items for optimized build
import 'node_modules/openlayers/dist/ol.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css!';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css!';
import './css/viewer.css!';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

import 'bootstrap';

//import components used by this app
//TODO: these may be converted into <can-import> tags eventually
import 'components/measure-widget/';
import 'components/ol-layer/ol-layer-tilewms';
import 'components/ol-map/';
import 'components/panel-container/';
import 'components/tab-container/';
import 'components/identify-widget/';
import 'components/ol-popup/';
import 'components/locator-widget/';
import 'components/print-widget/';
import 'components/layer-control/';
import 'components/crud-manager/';
import 'components/layer-control/layer-components/Default';
import 'components/layer-control/layer-components/Group';
import 'components/layer-control/layer-components/TileWMS';
