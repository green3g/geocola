
//import the css used in this app and config items for optimized build
import 'node_modules/openlayers/dist/ol.css!';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap/dist/css/bootstrap-theme.min.css!';
import 'font-awesome/css/font-awesome.min.css';
import './css/viewer.css!';

import 'bootstrap/dist/js/bootstrap.min';

//import components used by this app
//TODO: these may be converted into <can-import> tags eventually
import 'geocola-map/measure-widget/measure-widget';
import 'geocola-map/ol-map/ol-map';
import 'geocola-map/identify-widget/identify-widget';
import 'geocola-map/ol-popup/ol-popup';
import 'geocola-map/locator-widget/locator-widget';
import 'geocola-map/print-widget/print-widget';
import 'geocola-map/layer-control/layer-control';
import 'geocola-map/layer-control/layer-components/Default';
import 'geocola-map/layer-control/layer-components/Group';
import 'geocola-map/layer-control/layer-components/TileWMS';
import 'geocola-ui/panel-container/panel-container';
import 'geocola-ui/tab-container/tab-container';
import 'geocola-crud/crud-manager/crud-manager';
