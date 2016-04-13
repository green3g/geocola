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
    currentFiles: {
      Value: can.List
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
  init: function(){
    if(this.attr('properties.value')){
      this.attr('currentFiles').replace(
        this.attr('properties.value').split(',').filter(function(file){
          return file !== '';
        })
      );
    }
  },
  onChange(element) {
    if (element.files) {
      this.uploadFiles(element.files);
    }
  },
  uploadFiles(files) {
    var data = new FormData();
    for(var i = 0; i < files.length; i ++){
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
  updateValue(){
    if(this.attr('currentFiles').length){
      this.attr('properties.value', this.attr('currentFiles').join(','));
    } else {
      this.attr('properties.value', '');
    }
    this.dispatch('change', [this.attr('properties.value')]);
  },
  uploadError(response, textStatus, errorThrown) {
    // Handle errors here
    console.warn('ERRORS: ', response, textStatus, errorThrown);
    // STOP LOADING SPINNER
  },
  removeFile(file){
    this.attr('state', can.ajax({
      url: this.attr('properties.url'),
      type: 'DELETE',
      data: {
        file: file
      },
      success: this.removeSuccess.bind(this, file),
      error: this.removeError.bind(this, file)
    }));
  },
  removeSuccess(file, response){
    this.attr('currentFiles').splice(this.attr('currentFiles').indexOf(file), 1);
    this.updateValue();
  },
  removeError(file, response){
    if(response.status === 404){
      //file doesn't exist, remove it from this widget
      this.removeSuccess(file, response);
    }
    console.warn('Error: ', response);
  }
})

can.Component.extend({
  tag: 'file-field',
  template: template,
  viewModel: ViewModel
});
