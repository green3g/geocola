import widgetModel from '../widget-model';
import Component from 'can/component/';
/**
 * @module panel-container
 */
import template from './panel.stache!';
import './panel.css!';
/**
 * @constructor components/panel-container.ViewModel ViewModel
 * @parent components/panel-container
 * @group components/panel-container.ViewModel.props Properties
 *
 * @description A `<panel-container />` component's ViewModel
 */
export const ViewModel = widgetModel.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * The title to use in the tab for this panel
     * @property {String} components/panel-container.ViewModel.props.title
     * @parent components/panel-container.ViewModel.props
     */
    title: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * The heading to use in the collapsible header
     * @property {String} components/panel-container.ViewModel.props.heading
     * @parent components/panel-container.ViewModel.props
     */
    heading: {
      type: 'string',
      value: 'Panel'
    },
    /**
     * Whether or not this panel is visible by default in the tab container
     * @property {Boolean} components/panel-container.ViewModel.props.visible
     * @parent components/panel-container.ViewModel.props
     */
    visible: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsed by default
     * @property {Boolean} components/panel-container.ViewModel.props.open
     * @parent components/panel-container.ViewModel.props
     */
    open: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this panel is collapsible
     * @property {Boolean} components/panel-container.ViewModel.props.collapsible
     * @parent components/panel-container.ViewModel.props
     */
    collapsible: {
      type: 'boolean',
      value: false
    }
  },
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

export default Component.extend({
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
