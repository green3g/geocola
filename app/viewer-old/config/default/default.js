/*jshint esnext:true */
/*
This is an example config file for the viewer app. It imports the different pieces to configure and exports a config object for the app to load. Note: all of these individual files could in theory be kept in one config file, but it is easier to reuse parts of the config if they are stored in different files, and it is easier to configure in pieces as well.
 */

/*
To begin, we import some custom projections that we have defined in the custom_projections.js. This is because one of our layers uses a projection not included by default in openlayers.
 */
import './custom_projections';

/*
This line imports our map options from the map.js file. The variable name is not important here, it is simply assigning the value of whatever map's default export is to mapOptions.
 */
import mapOptions from './map';

/*
Same for identify, we assign the default export from identify to the identify/identify.js. Note the trailing slash. This file contains all of the individual configs for the layers and their fields for the identify popup.
 */
import identify from './identify/';

/*
This syntax imports the exports named `printProvider` and `locationProvider`. This is because providers exports two named properties, not just a default object.
 */
import {printProvider, locationProvider} from './providers';

/*
Finally export all of our config for the app to run
 */
export let config = {
  mapOptions: mapOptions,
  layerProperties: identify,
  locationProvider: locationProvider,
  printProvider: printProvider
};
