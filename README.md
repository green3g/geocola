
<!--
@page geocola Home
@group geocola.components Components
@group geocola.providers Providers
@group geocola.types Type Definitions
-->

## GeoCola - Configureable Openlayers App

Currently under development. A configureable, modular, map viewing application.

[![Gitter](https://badges.gitter.im/roemhildtg-geocola/Lobby.svg)](https://gitter.im/roemhildtg-geocola/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Features
 - View nearly any type of geographic data. Any layer type supported by Openlayers 3 is supported by Geocola
 - Identify WMS and Tiled WMS layers in a popup
 - Measure point locations, line distances, and polygon areas
 - Print Openlayer 3 maps using a supported print service (currently supports Mapfish)
 - Toggle layers and sublayers on and off, including grouped WMS layers using a layer tree

## Components

Geocola consists of the following components all of which can be used individually:

 * [spectre-canjs](https://github.com/roemhildtg/spectre-canjs) - A data administration component library built on the Spectre.css framework enabled with CanJS
 * [can-geo](https://github.com/roemhildtg/can-geo) - Web mapping web components built using CanJS

## Getting started

### Requirements
* NodeJS (npm install)
* A production web server (apache, nginx), a development server through nodejs is provided
* A wms compatible mapserver, like Geoserver

### Setup the project
```bash
# get the code
git clone http://path-to-this-repository

# change to this directory
cd geocola

# setup requirements
npm install

# run a development server on localhost:8080
npm serve
```

The application should run in a web browser now using `http://localhost:8080/index-dev.html`. To build it for production:
```bash
npm run build
```

Use `index.html` to use the production build

## Open source projects used

 * [Openlayers 3](http://openlayers.org/) - *"A high-performance, feature-packed library for all your mapping needs."*
 * [CanJS](http://canjs.com/) - *Custom web components, 2-way binding mustache and handlebar templates*
 * [StealJS](http://stealjs.com/) - *Dependency loader and builder/optimizer*
 * [Spectre.css] - a lightweight, responsive and modern CSS framework.
 * [Font Awesome](https://fortawesome.github.io/Font-Awesome/) - *The iconic font and CSS toolkit*

## Contributing
* Additional tests and documentation
* Constructive criticism and code reviews
* Pull requests and widget enhancements/additions

## Related projects
 - [CMV](https://github.com/cmv/cmv-app)
 - [OCMV](https://github.com/vojvod/ocmv)

