/*jshint esnext:true */

const DEFAULT_APP = 'app/viewer/';
const DEFAULT_CONFIG = 'default';

/**
 * A query string parameter parser
 * @param  {String} str The property to extract
 * @return {String}     The extracted value
 */
function getQueryParameters(str) {
  return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function(n) {
    return n = n.split("="), this[n[0]] = n[1], this;
  }.bind({}))[0];
}

/**
 * imports multiple modules and returns a promise resolved to an array
 * of modules
 *
 * @param  {String[]} modules Array of module paths to import
 * @return {Object[]} Array of modules returned
 */
function multiImport(modules) {
  return Promise.all(modules.map(function(m) {
    return System.import(m);
  }));
}

// get the app file from the url if present
//otherwise load app/viewer/config/default/ in the app/viewer/
var params = getQueryParameters(window.location.search);
var app = params.app || DEFAULT_APP;
var config = params.config || DEFAULT_CONFIG;

if (!config) {
  System.import(app).then(function(module) {
    new module.AppViewModel().startup('#app');
  });
} else {

  //get the optional config paths
  //default is app/appname/config/defaultConfigName/
  var configPath = [
    app,
    'config/',
    params.config || DEFAULT_CONFIG,
    '/'
  ].join('');

  //import the modules and start the app
  multiImport([app, configPath]).then(function(modules) {
    new modules[0].AppViewModel(modules[1].config).startup('#app');
  });
}
