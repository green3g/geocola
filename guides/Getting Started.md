<!--
@page guides Getting Started
@parent Home
@link ./components.html Components
-->

## Directory Structure
The project is divided into several folders.
* `components`: The collection of reuseable web components used throughout the application
* `app`: The core app controls, templates, and configuration files
* `models`: Data models for interracting with REST api's
* `test`: The base testing html and importer
* `providers`: Service providers for components like printing and location services

## Bundles

Bundles are created to optimize the loading of an app. In development, an app may load many individual files. Steal-tools scans these dependencies and creates highly optimized bundles which load much quicker. To configure additional bundles, add the path to the bundle in package.json bundles section.
