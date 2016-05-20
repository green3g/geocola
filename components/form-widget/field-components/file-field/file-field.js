import can from 'can/util/library';
import List from 'can/list/';
import CanMap from 'can/map/';
import Component from 'can/component/';

import widgetModel from '../../../widget-model';
import template from './file-field.stache!';

/**
 * @constructor components/form-widget/field-components/file-field.ViewModel ViewModel
 * @parent components/form-widget/field-components/file-field
 * @group components/form-widget/field-components/file-field.ViewModel.props Properties
 *
 * @description A `<file-field />` component's ViewModel
 */
export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: CanMap
    },
    currentFiles: {
      get: function initCurrentFiles(val, set) {
        if (!val) {
          if (this.attr('value')) {
            val = new List().concat(this.attr('value').split(',').filter(function(file) {
              return file !== '';
            }));
          } else {
            val = new List();
          }
        }

        set(val);
        return val;
      }
    },
    state: {
      value: {
        isResolved: true
      }
    },
    progress: {
      type: 'number',
      value: 100
    }
  },
  onChange(element) {
    if (element.files) {
      if (!this.attr('properties.multiple') && this.attr('currentFiles').length) {
        let self = this;
        this.removeFile(this.attr('currentFiles')[0]).then(function() {
          self.uploadFiles(element.files);
        });
      } else {
        this.uploadFiles(element.files);
      }
    }
  },
  uploadFiles(files) {
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
      data.append(i, files.item(i));
    }
    var self = this;
    this.attr('state', can.ajax({
      url: this.attr('properties.url'),
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: this.uploadSuccess.bind(this),
      error: this.uploadError.bind(this)
    }));
  },
  uploadSuccess(data, textStatus, jqXHR) {
    if (typeof data.error === 'undefined') {
      this.attr('currentFiles', this.attr('currentFiles').concat(data.uploads));
      this.updateValue();
    } else {
      // Handle errors here
      console.warn('ERRORS: ', data.error);
    }
  },
  updateValue() {
    if (this.attr('currentFiles').length) {
      this.attr('value', this.attr('currentFiles').join(','));
    } else {
      this.attr('value', '');
    }
    this.dispatch('change', [this.attr('value')]);
  },
  uploadError(response, textStatus, errorThrown) {
    // Handle errors here
    console.warn('ERRORS: ', response, textStatus, errorThrown);
    // STOP LOADING SPINNER
  },
  removeFile(file) {
    this.attr('state', can.ajax({
      url: this.attr('properties.url'),
      type: 'DELETE',
      data: {
        file: file
      },
      success: this.removeSuccess.bind(this, file),
      error: this.removeError.bind(this, file)
    }));
    return this.attr('state');
  },
  removeSuccess(file, response) {
    this.attr('currentFiles').splice(this.attr('currentFiles').indexOf(file), 1);
    this.updateValue();
  },
  removeError(file, response) {
    if (response.status === 404) {
      //file doesn't exist, remove it from this widget
      this.removeSuccess(file, response);
    }
    console.warn('Error: ', response);
  }
});

Component.extend({
  tag: 'file-field',
  template: template,
  viewModel: ViewModel
});
