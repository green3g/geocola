/* jshint esnext: true */
import can from 'can';
import 'components/panel-container/';
import template from './tabs.stache!';
/**
 * @module tab-container
 * @parent Home.components
 * @description
 A basic tab container. Works with [panel-container](./panel-container.html) components.
 * @signature `<tab-container />` Example:

 ```html
   <tab-container></tab-container>
 ```
 */
export const ViewModel = can.Map.extend({
  define: {
    /**
     * the list of panel objects
     * @property {can.List} panels
     */
    panels: {
      Value: can.List
    }
  },
  /**
   * @prototype
   */
  /**
   * @description
   * Adds a new panel to the tab container
   * @signature
   * @param  {can.Map} panel The panel view model to add
   * @return {can.Map} Returns this object
   */
  addPanel: function(panel) {
    var panels = this.attr('panels');
    if (panels.indexOf(panel) !== -1) {
      return this;
    }
    panels.push(panel);
    panel.hide();
    if (panels.attr('length') === 1) {
      this.activate(panel);
    }
    return this;
  },
  /**
   * Removes a panel
   * @param  {can.Map} panel The panel view model to remove
   * @return {can.Map} Returns this object
   */
  removePanel: function(panel) {
    var panels = this.attr('panels');
    var index = panels.indexOf(panel);
    panels.splice(index, 1);
    if (this.attr('active') === panel) {
      panels.attr('length') ? this.activate(panels[0]) : this.attr('active', null);
    }
    return this;
  },
  /**
   * Activates a panel
   * @param  {can.Map} panel The panel view model to activate
   * @return {can.Map} Returns this object
   */
  activate: function(panel) {
    can.batch.start();
    var active = this.attr('active');
    if (active !== panel) {
      active && active.hide();
      this.attr('active', panel.show());
    }
    can.batch.stop();
    return this;
  }
});

export default can.Component.extend({
  tag: 'tab-container',
  viewModel: ViewModel,
  template: template
});
