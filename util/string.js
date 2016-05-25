import can from 'can/util/string/';

/**
 * Formats the field by replacing underscores with spaces and capitalizing the first letter
 * @signature
 * @param  {String} text The name of the field
 * @return {String} The formatted field string. Example: `my_field_name` will become `My field name`.
 */
export let makeSentenceCase = text => {
  text = String(text);
  return can.capitalize(can.trim(
    text.split('_')
    .join(' ')
    .toLowerCase()
    .replace(/ +/g, " ")
  ));
};
