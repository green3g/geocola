<!--
@page guides Getting Started
@parent Home
@link ./components.html Components
@group guides.administer Administer
@group guides.developing Develop
@group guides.configure Configure
-->

@description

## loader.js

This is the loader script. It decides which application to load, and which config to load into the app. It does so using default values and optional query parameters.

@signature `?app=app/path/&config=configName`
@param {String} app The path to the app to load.
The default is `app/viewer/`.
@param {String} config The name to the config to load inside appPath/config/. The default is `default` which will load `app/viewer/default/`.

@body

## Directory Structure
The project is divided into several folders.
* `app`: The core app controls, templates, and configuration files
* `components`: The collection of reuseable web components used throughout the application
* `models`: Data models for interracting with REST api's
* `test`: The base testing html and importer
* `providers`: Service providers for components like printing and location services
* `dist`: When steal builds the app, it creates bundles and places them in this directory

## File paths
StealJS, the loader behind this project loads files based on the root of the directory. Here are examples of paths and what will be loaded by Steal.

- `app/myapp/main` will load the file at `app/myapp/main.js`
- `app/myapp` will load the file at `app/myapp.js`
- `app/myapp/` (note the trailing slash) will load the file at `app/myapp/myapp.js`

## App Directory (app)

Apps are files that use components, models, and providers to provide a fully functional application. The default apps contain a few different directories to keep things organized.

 - `config`: A folder to hold different configurations for each application. By design, an application is configureable to allow it to be used for multiple different types of data and users.
 - `css` and `images`: styles and media specific for that application
 - `*.js`: The core application files

## Components Directory (components)

Components are reuseable and modular 'widgets'. To use a component in an app, it must be imported.
[Read more about components](guides.developing.components)

## Providers Directory (providers)

Providers connect widgets to web services. This allows a generic widget, like a print button/list to utilize almost any print server, so long as a provider exists to connect the two.

Read more about providers on the following pages:
- [Location Providers Specification]( providers.locationProvider)
- [Print Providers Specification](providers.printProvider)

## Bundles Directory (dist)

During development, index-dev.html should be used. This loads each individual module and when they are changed, these changes will be reflected after clearing the browser cache. However, it is not very efficient for production.

Bundles are created to optimize the loading of an app. In development, an app may load many individual files. Steal-tools scans these dependencies and creates highly optimized bundles which load much quicker. To configure additional bundles, add the path to the bundle in package.json bundles section.

Once the bundles are built, index.html should be used to load `steal.production.js` instead of `steal.js`. In addition, `main` must be set on the script tag. By default, it is set to `Canola Map`.

```html
<script src="node_modules/steal/steal.production.js" data-main="Canola Map"></script>
```
