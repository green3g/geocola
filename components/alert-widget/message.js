import CanMap from 'can/map/';

/*
 * A generic message object map used for passing messages between components and
 * applications
 */
export const Message = CanMap.extend({
  message: '',
  detail: null,
  autoHide: true,
  timeout: 10000,
  level: 'success'
});
