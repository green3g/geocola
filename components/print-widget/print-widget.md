<!--

@module {can.Component} components/print-widget <print-widget />
@parent geocola.components

-->

# Description
A simple print widget that allows the user to select various layouts and print settings before creating an openlayers printout.

<img src="static/img/components/print-widget.png" />

# Usage

```html
  <!-- template.stache -->
   <print-widget map-node="#main-map" {provider}="myProvider" />
```

```javascript
 //app.js
 import template from './template.stache!';
 import MapfishProvider from 'providers/print/MapfishPrint';

 can.$('body').append(can.view(template, {
   myProvider: new MapfishProvider({
     //sample url
     url: '/proxy/geoserver/pdf',
     method: 'POST'
   });
 }));
```
