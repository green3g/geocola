import CanMap from 'can/map/';

/*
 * A generic view object to inherit from.
 */
export const ViewMap = CanMap.extend({
  saveSuccessMessage: 'Object saved.',
  saveFailMessage: 'Object could not be saved.',
  deleteSuccessMessage: 'Object removed.',
  deleteFailMessage: 'Object could not be removed.',
  disableEdit: false,
  disableDelete: false,
  disableAdd: false
});
