/* jshint esnext:true */
import can from 'can';
import widgetModel from 'components/widget-model';
/**
 * @module panel-container
 * @parent Home.components
 * @description
 *
A panel container. Works with [tab-container](./tab-container.html) components or as a standalone collapsible panel.
 * @signature `<panel-container />` Example:

 ```html
   <tab-container>
     <panel-container attributes="...">
       <div>content in this panel</div>
     </panel-container>
     <!--additional panels -->
   </tab-container>
 ```
 */
import template from './panel.stache!';
import './panel.css!';
export const ViewModel = widgetModel.extend({
  define: {
    /**
     * @description
     * The title to use in the tab for this panel
     * @property {String} title
     */
    title: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * The heading to use in the collapsible header
     * @property {String}
     */
    heading: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * Whether or not this panel is visible by default in the tab container
     * @property {Boolean}
     */
    visible: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsed by default
     * @property {Boolean}
     */
    open: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsible
     * @property {Boolean}
     */
    collapsible: {
      type: 'boolean',
      value: false
    }
  },
  toggle: function() {
    this.attr('open', !this.attr('open'));
  },
  hide: function() {
    this.attr('visible', false);
    this.dispatch('hide', [this]);
    return this;
  },
  show: function() {
    this.attr('visible', true);
    this.dispatch('show', [this]);
    return this;
  }
});

export default can.Component.extend({
  tag: 'panel-container',
  template: template,
  viewModel: ViewModel,
  events: {
    inserted: function() {
      if (this.element.parent().viewModel().addPanel) {
        this.element.parent().viewModel().addPanel(this.viewModel);
      }
    },
    removed: function() {
      if (this.element.parent().viewModel().removePanel) {
        this.element.parent().viewModel().removePanel(this.viewModel);
      }
    }
  }
});
