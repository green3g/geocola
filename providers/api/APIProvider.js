/**
 * @module {can.Map} providers.apiProvider API Provider Spec
 * @parent Home.providers
 * @description
 * API Providers utilize can-connect to provide high performance api interaction.
 * @group providers.apiProvider.types Types
 */

/**
 * @typedef {connectInfoObject} providers.apiProvider.types.connectInfoObject ConnectInfoObject
 * @parent providers.apiProvider.types
 * @option {can.Model | superMap} connection The data model used to create, update and delete objects.
 * @option {can.Map | object} map The object used to create new objects. This object can be used to specify default values and properties when creating new empty objects.
 * @option {can.List | Array} list The list used internally by can-connect
 * @option {Object} properties Additional metadata about the api and data
 */
