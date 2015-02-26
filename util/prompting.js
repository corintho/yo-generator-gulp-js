'use strict';
module.exports.findValue = function(array, value) {
  var idx = 0,
      len = array.length;
  for (; idx < len; idx++) {
    var val = array[idx];
    if (typeof val === 'object' && val.hasOwnProperty('value')) {
      if (val.value === value) {
        return idx;
      }
    }
  }
};
