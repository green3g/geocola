//provides can.extend
import can from 'can/util/library';
import CanMap from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import Component from 'can/component/';
import template from './template.stache!';
/**
 * @constructor components/form-widget.ViewModel ViewModel
 * @parent components/form-widget
 * @group components/form-widget.ViewModel.props Properties
 * @group components/form-widget.ViewModel.events Events
 *
 * @description A `<form-widget />` component's ViewModel
 */
export let ViewModel = CanMap.extend({
  /**
   * @prototype
   */
  define: {
    /**
     * Whether or not to show the submit/cancel buttons
     * @property {Boolean} components/form-widget.ViewModel.props.showButtons
     * @parent components/form-widget.ViewModel.props
     */
    showButtons: {
      type: 'boolean',
      value: true
    },
    /**
     * Whether or not this form should be a bootstrap inline form
     * @property {Boolean} components/form-widget.ViewModel.props.inline
     * @parent components/form-widget.ViewModel.props
     */
    inline: {
      type: 'boolean',
      value: false
    },
    /**
     * The connection info for this form's data. If this is provided, the object will be fetched using the objectId property
     * @property {connectInfoObject} components/form-widget.ViewModel.props.connection
     * @parent components/form-widget.ViewModel.props
     */
    connection: {
      value: null
    },
    /**
     * The object id of the item to retrieve. If this is provided, a request will be made to the connection object with the specified id.
     * @property {Number} components/form-widget.ViewModel.props.objectId
     * @parent components/form-widget.ViewModel.props
     */
    objectId: {
      type: 'number',
      set: function(id) {
        let promise = this.fetchObject(this.attr('connection'), id);
        this.attr('promise', promise);
        return id;
      }
    },
    /**
     * The pending promise if the object is being retrieved or null
     * @property {Promise}  components/form-widget.ViewModel.props.promise
     * @parent components/form-widget.ViewModel.props
     */
    promise: {
      value: null
    },
    /**
     * An object representing a can.Map or similar object. This object should have
     * a `save` method like a `can.Model` or `can-connect.superMap`. This object is
     * updated and its `save` method is called when the form is submitted.
     * @property {can.Map} components/form-widget.ViewModel.props.formObject
     * @parent components/form-widget.ViewModel.props
     */
    formObject: {
      Value: CanMap
    },
    /**
     * The list of form fields properties. These can be specified as strings representing the field names or the object properties described in the FormFieldObject
     * @property {Array<String|geocola.types.FormFieldObject>} components/form-widget.ViewModel.props.fields
     * @parent components/form-widget.ViewModel.props
     */
    fields: {
      Value: List,
      get(fields){
        return fields.filter(f => {
          return !f.excludeForm;
        });
      }
    }
  },
  /**
   * Fetches and replaces the formObject with a new formObject
   * @param  {superMap} con The supermap connection to the api service
   * @param  {Number} id  The id number of the object to fetch
   */
  fetchObject(con, id) {
    if (!con || !id) {
      return;
    }
    var self = this;
    var promise = con.get({
      id: id
    });
    promise.then(function(obj) {
      self.attr('formObject', obj);
    });
    return promise;
  },
  /**
   * Called when the form is submitted. The object is updated by calling it's `save` method. The event `submit` is dispatched.
   */
  submitForm() {
    let formObject = this.attr('formObject');
    this.dispatch('submit', [formObject]);
    return false;
  },
  /**
   * Sets the formObject value when a field changes. This will allow for future
   * functionality where the form is much more responsive to values changing, like
   * cascading dropdowns.
   * @param  {formFieldObject} field  The field object properties
   * @param  {domElement} domElement The form element that dispatched the event
   * @param  {Event} event  The event object and type
   * @param  {Object | Number | String} value  The value that was passed from the field component
   */
  setField(field, domElement, event, value) {
    var obj = this.attr('formObject');
    obj.attr(field.name, value);
    this.dispatch('fieldChange', [obj]);
  },
  /**
   * @typedef {can.Event} form-widget.events.formCancel cancel
   * @parent form-widget.events
   * An event dispatched when the cancel button is clicked. No arguments are passed.
   */
  /**
   * Called when the form cancel button is clicked. Dispatches the `cancel` event.
   * @signature
   */
  cancelForm() {
    this.dispatch('cancel');
  },
  /**
   * Fetches a value from the formObject
   * @param  {String} fieldName The name of the field to return
   * @return {*} The value of the object's property
   */
  getFieldValue(field){
    return this.attr('formObject.' +  field.attr('name'));
  }
});

Component.extend({
  tag: 'form-widget',
  viewModel: ViewModel,
  template: template
});
