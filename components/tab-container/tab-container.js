import can from 'can/util/';
import List from 'can/list/';
import CanMap from 'can/map/';
import 'can/map/define/';
import Component from 'can/component/';
import template from './tabs.stache!';
/**
 * @constructor components/tab-container.ViewModel ViewModel
 * @parent components/tab-container
 * @group components/tab-container.ViewModel.props Properties
 *
 * @description A `<tab-container />` component's ViewModel
 */
export const ViewModel = CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * the list of panel objects. TThis propert is updated automatically when a panel
     * is inserted inside of a tab-container.
     * @property {can.List<components/panel-container.ViewModel>} components/tab-container.ViewModel.props.panels
     * @parent components/tab-container.ViewModel.props
     */
    panels: {
      Value: List
    }
  },
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
    can.batch.start();
    panels.push(panel);
    panel.hide();
    if (panels.attr('length') === 1) {
      this.activate(panel);
    }
    can.batch.stop();
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
    can.batch.start();
    panels.splice(index, 1);
    if (this.attr('active') === panel) {
      let dummy = panels.attr('length') ? this.activate(panels[0]) : this.attr('active', null);
    }
    can.batch.stop();
    return this;
  },
  /**
   * Activates a panel
   * @param  {can.Map} panel The panel view model to activate
   * @return {can.Map} Returns this object
   */
  activate: function(panel) {
    var active = this.attr('active');
    if (active !== panel) {
      let dummy = active && active.hide();
      this.attr('active', panel.show());
    }
    return false;
  }
});

export default Component.extend({
  tag: 'tab-container',
  viewModel: ViewModel,
  template: template
});
