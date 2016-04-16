<!--
@page geocola Home
@group geocola.components Components
@group geocola.providers Providers
@group geocola.types Type Definitions
-->

## GeoCola - Configureable Openlayers App

A configureable set of client side web applications built on modular and reuseable web components.

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/roemhildtg/geocola?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

![Overall Image](http://roemhildtg.github.io/geocola/docs/static/img/overall-screenshot.png)

## Getting started
[See a working demo](http://roemhildtg.github.io/geocola/index.html)

[Read the full documentation for details](http://roemhildtg.github.io/geocola/docs)

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

The application should run in a web browser now. To build it for production:
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
