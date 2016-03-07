<!--
@page Home Cola
-->

## Configureable Openlayers App

A configureable modular javascript app inspired by [CMV](https://github.com/cmv/cmv-app).

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/roemhildtg/col-map?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

There are 4 goals with this project:
* Learn how to write better Javascript
* Develop modular and reusable widgets to use with the Openlayers/WMS stack
* Allow non-devs to implement an Open-Source web application by utilizing simple web components
* Utilize a flexible, and easy to configure build system

## Current Widgets
* Openlayers Map - tested
* Identify Popup - beta
* Measure Tool - beta
* Print - beta

## Getting started

## Requirements
* NodeJS
* A simple web server
* A wms compatible mapserver, like Geoserver

## Setup the project
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

## Client technology used
* [Openlayers 3](http://openlayers.org/) - *"A high-performance, feature-packed library for all your mapping needs."*
* [CanJS](http://canjs.com/) - *Custom web components, 2-way binding mustache and handlebar templates*
* [StealJS](http://stealjs.com/) - *Dependency loader and builder/optimizer*
* [Bootstrap 3](http://getbootstrap.com/) - *Front end ui framework*

## Contributing
* Constructive criticism and code reviews
* Pull requests and widget enhancements/additions
