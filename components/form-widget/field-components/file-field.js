import can from 'can';
import widgetModel from 'components/widget-model';

import template from './file-field.stache!';

/**
 * @module form-widget.fields.text Text
 * @parent form-widget.fields
 * @body
 * A file upload field. It POST's the upload to a special url and returns the url result as text to the form.
 *
 * `type: 'file'`
 */

/**
 * @typedef {fileFieldProperties} form-widget.types.fileFieldProperties fileFieldProperties
 * @parent form-widget.types
 * @option {String} url The url up post the file upload to
 * @option {Boolean} multiple Whether or not to allow multiple uploads
 * @option {String} accept The type of media to accept
 * @link http://www.w3schools.com/tags/att_input_accept.asp Input Accept Types
 */

export let ViewModel = widgetModel.extend({
  define: {
    properties: {
      Value: can.Map
    },
    pendingFiles: {
      Type: can.List
    },
    currentFiles: {
      get: function() {
        var val = this.attr('properties.value');
        if (val) {
          return val.split(',');
        }
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
      this.attr('pendingFiles', element.files);
    }
  },
  uploadFiles() {
    var files = this.attr('pendingFiles');
    var data = new FormData();
    files.forEach(function(f, index) {
      data.append(index, f)
    });
    let val = this.attr('properties.value');
    if (val) {
      data.append('replace', val);
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
      this.attr('properties.value', data.url);
      var fieldValue = data.uploads.join(',');
      this.dispatch('change', [fieldValue]);
    } else {
      // Handle errors here
      console.warn('ERRORS: ', data.error);
    }
    this.attr('pendingFiles').replace([]);
  },
  uploadError(jqXHR, textStatus, errorThrown) {
    // Handle errors here
    console.warn('ERRORS: ', textStatus);
    // STOP LOADING SPINNER
  }
})

can.Component.extend({
  tag: 'file-field',
  template: template,
  viewModel: ViewModel
});
