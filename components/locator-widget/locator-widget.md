<!--

@module {can.Component} components/locator-widget <locator-widget />
@parent geocola.components

-->

## Description
 A widget for getting and displaying suggestions and address locations from a geocoder provider. Optionally navigates and displays locations to an `ol-map` component.

## Usage

```html
 <!-- template.stache -->
 <locator-widget {provider}="myProvider" map-node="#map" />
```

```javascript
//app.js
import template from './template.stache!';
import EsriProvider from 'providers/location/EsriGeocoder';

can.$('body').append(can.view(template, {
  myProvider: new EsriProvider({
    //sample url
    url: '/arcgis/rest/services/World/GeocodeServer/'
  });
}));
```
