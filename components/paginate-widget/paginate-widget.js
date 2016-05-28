import CanMap from 'can/map/';
import 'can/map/define/';
import List from 'can/list/';
import Component from 'can/component/';
//import './paginate-widget.css!';
import template from './template.stache!';
/**
 * @constructor components/paginate-widget.ViewModel ViewModel
 * @parent components/paginate-widget
 * @group components/paginate-widget.ViewModel.props Properties
 *
 * @description A `<paginate-widget />` component's ViewModel
 */
export let ViewModel = CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * The number of pages to show in the widget
     * @property {Number} components/paginate-widget.ViewModel.props.pages
     * @parent components/paginate-widget.ViewModel.props
     */
    pages: {
      type: 'number',
      value: 10
    },
    /**
     * The active page index
     * @property {Number} components/paginate-widget.ViewModel.props.activePageIndex
     * @parent components/paginate-widget.ViewModel.props
     */
    activePageIndex: {
      value: 0,
      type: 'number'
    },
    /**
     * The number of pages to show on either side of the currently selected page. The default is 3. For example, if the selected page is 5, the visible pages should be 2,3,4,5,6,7,8.
     * @property {Number}  components/paginate-widget.ViewModel.props.activeOffset
     * @parent components/paginate-widget.ViewModel.props
     */
    activeOffset: {
      value: 3,
      type: 'number'
    },
    /**
     * A virtual property used by the template to indicate whether or not there is a next page
     * @property {Boolean} components/paginate-widget.ViewModel.props.hasNext
     * @parent components/paginate-widget.ViewModel.props
     */
    hasNext: {
      get() {
        return this.attr('activePageIndex') < this.attr('pages') - 1;
      }
    },
    /**
     * A virtual property used by the template to indicate whether or not there is a previous page
     * @property {Boolean} components/paginate-widget.ViewModel.props.hasPrevious
     * @parent components/paginate-widget.ViewModel.props
     */
    hasPrevious: {
      get() {
        return this.attr('activePageIndex') > 0;
      }
    },
    /**
     * The array of currently shown pages in the widget
     * @property {Array<Number>} components/paginate-widget.ViewModel.props.visiblePages
     * @parent components/paginate-widget.ViewModel.props
     */
    visiblePages: {
      get() {
        var pages = this.attr('pages');
        var active = this.attr('activePageIndex') + 1;
        var offset = this.attr('activeOffset');
        var arr = this.attr('pageArray').filter(p => {
          return p <= active + 3 && p >= active - 3 && p > 0 && p <= pages;
        });
        return arr;
      }
    },
    /**
     * The array of numbers 0 through number of pages. This is a helper for the visiblePages getter
     * @property {Array<Number>} components/paginate-widget.ViewModel.props.pageArray
     * @parent components/paginate-widget.ViewModel.props
     */
    pageArray: {
      get() {
        var arr = [];
        for (var i = 1; i <= this.attr('pages'); i++) {
          arr.push(i);
        }
        return arr;
      }
    }
  },
  /**
   * Navigates to the next page
   * @return {Boolean} returns false to prevent the link from navigating to the next page
   */
  gotoNext() {
    if (this.attr('hasNext')) {
      this.attr('activePageIndex', this.attr('activePageIndex') + 1);
    }
    return false;
  },
  /**
   * Navigates to the previous page
   * @return {Boolean} returns false to prevent the link from navigating to the next page
   */
  gotoPrevious() {
    if (this.attr('hasPrevious')) {
      this.attr('activePageIndex', this.attr('activePageIndex') - 1);
    }
    return false;
  },
  /**
   * Navigates to the first page
   * @return {Boolean} returns false to prevent the link from navigating to the next page
   */
  gotoFirst() {
    this.attr('activePageIndex', 0);
    return false;
  },
  /**
   * Navigates to the last page
   * @return {Boolean} returns false to prevent the link from navigating to the next page
   */
  gotoLast() {
    this.attr('activePageIndex', this.attr('pages') - 1);
    return false;
  },
  /**
   * Navigates to the page
   * @param {Number} p The page index to navigate to
   * @return {Boolean} returns false to prevent the link from navigating to the next page
   */
  gotoPage(p) {
    if (p > 0 && p <= this.attr('pages')) {
      this.attr('activePageIndex', p - 1);
    }
    return false;
  },
  /**
   * Checks to see if the passed page is the active page index
   * @param {Number} p The page to check
   * @return {Boolean} Returns a boolean value that tells the template whether or not the passed page is the active page
   */
  isActive(p) {
    return this.attr('activePageIndex') === p - 1;
  }
});

Component.extend({
  tag: 'paginate-widget',
  viewModel: ViewModel,
  template: template
});
