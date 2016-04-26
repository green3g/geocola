
import CanMap from 'can/map/';
import 'can/map/define/';
import CanEvent from 'can/event/';
import can from 'can/util/';
var count = 1;
function getNextId() {
  return count++;
}

/**
 * @parent geocola.components
 * @module widgetModel
 * @inherits can.Map
 *
 * @description Base widget class, not to be used directly, but inherited from.
 * Benefits include:
 * - guaranteed unique id (unless overridden by `instance-id `tag)
 * - capabilities from custom events provided by `can.event`
 *
 * Example:
 * ```
 * import widgetModel from 'components/widget-model'
 * export default widgetModel.extend({
 * 		customProp: value,
 * 		init: function(){
 * 			this.dispatch('customEvent', 1);
 * 		}
 * });
 * ```
 */
var widgetModel = CanMap.extend({
  define: {
    /**
     * @property {string} instanceId
     * A unique id that can be used by inherited widgets
     * to provide unique ids.
     */
    instanceId: {
      type: 'string'
    },
  },
  init: function() {
    //assign a unique id to this instanceId value
    if (!this.attr('instanceId')) {
      this.attr('instanceId', 'instance' + getNextId());
    }
  }
});

can.extend(widgetModel.prototype, CanEvent);
export default widgetModel;
