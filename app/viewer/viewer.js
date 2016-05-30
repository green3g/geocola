import can from 'can/util/library';
import CanMap from 'can/map/';
import 'can/map/define/';
//import components and css to include
import './components';
//import the app template
import template from './template.stache!';
import PubSub from 'pubsub-js';


export let AppViewModel = can.Map.extend({
  /**
   * @constructor app/viewer.ViewModel ViewModel
   * @parent start.configure.viewer
   * @group app/viewer.ViewModel.props Properties
   *
   * @description The viewer app App View Model
   */
  define: {
    /**
     * The openlayers map options passed to the `ol-map` component
     * @property {geocola.types.MapOptions} app/viewer.ViewModel.props.mapOptions
     * @parent app/viewer.ViewModel.props
     */
    mapOptions: {},
    /**
     * The layers and their configurations which are used by several layer components
     * @property {geocola.types.LayerPropertiesObject} app/viewer.ViewModel.props.layerProperties
     * @parent app/viewer.ViewModel.props
     */
    layerProperties: {},
    /**
     * The location provider for geocoding location names
     * @property {Object} app/viewer.ViewModel.props.locationProvider
     * @parent app/viewer.ViewModel.props
     * @link providers__location__LocationProvider.html Location Providers
     */
    locationProvider: {},
    /**
     * The print service provider for generating output file maps
     * @property {Object} app/viewer.ViewModel.props.printProvider
     * @parent app/viewer.ViewModel.props
     * @link providers__print__printProvider.html Print Providers
     */
    printProvider: {}
  },
  onDrag: function() {
    console.log(arguments);
  },
  /**
   * Starts the app
   * @signature
   * @param  {String} domNode The dom node to render the app
   */
  startup: function(domNode) {
    //render the template with the config
    can.$(domNode).html(can.view(template, this));

    //fix an issue with map stretching when steal builds the app
    setTimeout(function() {
      var maps = can.$('ol-map');
      maps.each(function(index, node) {
        var viewModel = can.$(node).viewModel();
        viewModel.attr('mapObject').updateSize();
      });
    }, 500);

    can.viewModel(document.getElementById('main-map')).on('resize', function(event, width) {
      can.viewModel(document.getElementById('identify-popup'), 'modal', width < 500);
    });
  },
  // initPubSub: function() {
  //   PubSub.subscribe(TOPICS.ADD_MESSAGE, (topic, message) => {
  //     this.attr('messages').push(message);
  //     if (message.autoHide) {
  //       setTimeout(() => {
  //         this.removeMessage(message);
  //       }, message.timeout);
  //     }
  //   });
  //
  //   PubSub.subscribe(TOPICS.CLEAR_MESSAGES, (topic, data) => {
  //     this.attr('messages').replace([]);
  //   });
  // },
  toggleMenu: function(e) {
    this.attr('sidebarHidden', !this.attr('sidebarHidden'));
    return false;
  },
  removeMessage: function(e) {
    var index = this.attr('messages').indexOf(e);
    var dummy = index !== -1 && this.attr('messages').splice(index, 1);
  }
});
