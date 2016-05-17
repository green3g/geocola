import CanMap from 'can/map/';

/*
 * A generic view object to inherit from.
 */
export const ViewMap = CanMap.extend({
  saveMessage: 'Object saved',
  deleteMessage: 'Object removed'
});
