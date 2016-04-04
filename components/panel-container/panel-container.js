/* jshint esnext:true */
import can from 'can';
import widgetModel from 'components/widget-model';
/**
 * @module panel-container
 */
import template from './panel.stache!';
import './panel.css!';
export const ViewModel = widgetModel.extend({
  define: {
    /**
     * The title to use in the tab for this panel
     * @property {String} panel-container.props.title
     * @parent panel-container.props
     */
    title: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * The heading to use in the collapsible header
     * @property {String} panel-container.props.heading
     * @parent panel-container.props
     */
    heading: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * Whether or not this panel is visible by default in the tab container
     * @property {Boolean} panel-container.props.visible
     * @parent panel-container.props
     */
    visible: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsed by default
     * @property {Boolean} panel-container.props.open
     * @parent panel-container.props
     */
    open: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsible
     * @property {Boolean} panel-container.props.collapsible
     * @parent panel-container.props
     */
    collapsible: {
      type: 'boolean',
      value: false
    }
  },
  /**
   * @prototype
   */
  /**
   * Opens or closes this panel if it is collapsible. Otherwise this will have no effect.
   * @signature
   * @return {can.Map} this view model
   */
  toggle: function() {
    this.attr('open', !this.attr('open'));
    return this;
  },
  /**
   * Hides this panel
   * @signature
   * @return {can.Map} this view model
   */
  hide: function() {
    this.attr('visible', false);
    this.dispatch('hide', [this]);
    return this;
  },
  /**
   * Shows this panel
   * @signature
   * @return {can.Map} this view model
   */
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
