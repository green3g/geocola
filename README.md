<!--
@page Home Home
@group Home.components Components
@group Home.providers Providers
-->

## Configureable Openlayers Map

A configureable set of client side web applications built on modular and reuseable web components.

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/roemhildtg/canola-map?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<img src="static/img/overall-screenshot.png" alt="Overall Screenshot" />
![Overall Image](guides/site/static/img/overall-screenshot.png)

There are 4 goals with this project:
* Learn how to write better Javascript
* Develop modular and reusable widgets to use with the Openlayers/WMS stack
* Utilize a flexible, and easy to configure build system
* Follow a flexible design to allow apps to be as configureable and reuseable as possible

## Getting started

[See the full guide for details](guides)

## Requirements
* NodeJS
* A web server (apache, nginx)
* A wms compatible mapserver, like Geoserver

## Optional requirements
Some of the widgets require some sort of an REST server. Flask paired with
Flask-Restless has been used in developing this application because it is easy
to set up and flexible enough to expand.

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

## Related projects
 - [CMV](https://github.com/cmv/cmv-app)
