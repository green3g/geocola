/*jshint esnext:true */
import './custom_projections';

import mapOptions from './map';
import identify from './identify/';
import {printProvider, locationProvider} from './providers';

export let config = {
  mapOptions: mapOptions,
  layerProperties: identify,
  locationProvider: locationProvider,
  printProvider: printProvider
};
