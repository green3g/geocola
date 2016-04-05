/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
//import './paginate-widget.css!';
import template from './template.stache!';

export let viewModel = Map.extend({
  define: {
    /**
     * The number of pages
     * @property {Number}
     */
    pages: {
      type: 'number',
      value: 10
    },
    /**
     * The active page index
     * @property {Number}
     */
    activePageIndex: {
      value: 0,
      type: 'number'
    },
    /**
     * Whether there is another page
     * @property {Object}
     */
    hasNext: {
      get: function() {
        return this.attr('activePageIndex') < this.attr('pages') - 1;
      }
    },
    /**
     * [hasPreviousFeature description]
     * @property {Object}
     */
    hasPrevious: {
      get: function() {
        return this.attr('activePageIndex') > 0;
      }
    },
    visiblePages: {
      get: function() {
        var pages = this.attr('pages');
        var active = this.attr('activePageIndex') + 1;
        var arr = this.attr('pageArray').filter(function(p) {
          return p <= active + 3 && p >= active - 3 && p > 0 && p <= pages;
        });
        return arr;
      }
    },
    pageArray: {
      get: function(){
        var arr = [];
        for (var i = 1; i <= this.attr('pages'); i++) {
          arr.push(i);
        }
        return arr;
      }
    }
  },
  gotoNext: function() {
    if (this.attr('hasNext')) {
      this.attr('activePageIndex', this.attr('activePageIndex') + 1);
    }
    return false;
  },
  gotoPrevious: function() {
    if (this.attr('hasPrevious')) {
      this.attr('activePageIndex', this.attr('activePageIndex') - 1);
    }
    return false;
  },
  gotoPage: function(p) {
    if (p > 0 && p <= this.attr('pages')) {
      this.attr('activePageIndex', p - 1);
    }
    return false;
  },
  isActive: function(p){
    return this.attr('activePageIndex') === p - 1;
  }
});

Component.extend({
  tag: 'paginate-widget',
  viewModel: viewModel,
  template: template
});
