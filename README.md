<!--
@page geocola Home
@group geocola.components Components
@group geocola.providers Providers
@group geocola.types Type Definitions
-->

## GeoCola - Configureable Openlayers App

A configureable set of client side web applications built on modular and reuseable web components.

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/geocola/geocola?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)   [![Build Status](https://travis-ci.org/geocola/geocola.svg?branch=master)](https://travis-ci.org/geocola/geocola)

![Overall Image](/geocola/docs/static/img/overall-screenshot.png)

## Components

Geocola consists of the following components all of which can be used individually:

 * geocola-ui - User interface bootstrap style components [![Build Status](https://travis-ci.org/geocola/geocola-ui.svg?branch=master)](https://travis-ci.org/geocola/geocola-ui)
 * geocola-map - Mapping components [![Build Status](https://travis-ci.org/geocola/geocola-map.svg?branch=master)](https://travis-ci.org/geocola/geocola-map)
 * geocola-crud - Data management and display tools [![Build Status](https://travis-ci.org/geocola/geocola-crud.svg?branch=master)](https://travis-ci.org/geocola/geocola-crud)

## Examples

 * [Data Manager App](http://geocola.github.io/geocola/index.htmlapp=app/crud/&config=default/default)
 * [Complete Mapping App](http://geocola.github.io/geocola/index.html)

## Getting started

[Read the full documentation for details](http://geocola.github.io/geocola/docs)

### Requirements
* NodeJS
* A web server (apache, nginx)
* A wms compatible mapserver, like Geoserver

### Optional requirements
Some of the widgets require some sort of an REST server. Flask paired with
Flask-Restless has been used in developing this application because it is easy
to set up and flexible enough to expand.

### Setup the project
```bash
git clone http://path-to-this-repository
npm install
```

The application should run in a web browser now. To try it out, check out the following urls:
 * `http://your-server/index-dev.html`
 * `http://your-server/index-dev.html?app=app/crud/&config=default/default`

To build it for production:
```bash
npm run build
```

Change index.html script to production:
```html
<script src="./node_modules/steal/steal.production.js" data-main="main"></script>
```

## Open source projects used

* [Openlayers 3](http://openlayers.org/) - *"A high-performance, feature-packed library for all your mapping needs."*
* [CanJS](http://canjs.com/) - *Custom web components, 2-way binding mustache and handlebar templates*
* [StealJS](http://stealjs.com/) - *Dependency loader and builder/optimizer*
* [Bootstrap 3](http://getbootstrap.com/) - *Front end ui framework*
* [Font Awesome](https://fortawesome.github.io/Font-Awesome/) - *The iconic font and CSS toolkit*

## Contributing
* Additional tests and documentation
* Constructive criticism and code reviews
* Pull requests and widget enhancements/additions

## Related projects
 - [CMV](https://github.com/cmv/cmv-app)
 - [OCMV](https://github.com/vojvod/ocmv)
