
import can from 'can';
import 'components/panel-container/';
import template from './tabs.stache!';
/**
 * @constructor components/tab-container.ViewModel ViewModel
 * @parent components/tab-container
 * @group components/tab-container.ViewModel.props Properties
 *
 * @description A `<tab-container />` component's ViewModel
 */
export const ViewModel = can.Map.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * the list of panel objects. TThis propert is updated automatically when a panel
     * is inserted inside of a tab-container.
     * @property {can.List} components/tab-container.ViewModel.props.panels
     * @parent components/tab-container.ViewModel.props
     */
    panels: {
      Value: can.List
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
