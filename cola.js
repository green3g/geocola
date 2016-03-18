/*jshint esnext:true */

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
export let start = function(app, config) {
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
      config || DEFAULT_CONFIG,
      '/'
    ].join('');

    //import the modules and start the app
    multiImport([app, configPath]).then(function(modules) {
      new modules[0].AppViewModel(modules[1].config).startup('#app');
    });
  }
}
