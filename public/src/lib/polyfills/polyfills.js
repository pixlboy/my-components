/*!
 * Polyfills required for uniform browser behaviour
 *
 */

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

 if (!Array.prototype.includes) {
     Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
       'use strict';
       var O = Object(this);
       var len = parseInt(O.length, 10) || 0;
       if (len === 0) {
         return false;
       }
       var n = parseInt(arguments[1], 10) || 0;
       var k;
       if (n >= 0) {
         k = n;
       } else {
         k = len + n;
         if (k < 0) {k = 0;}
       }
       var currentElement;
       while (k < len) {
         currentElement = O[k];
         if (searchElement === currentElement ||
            (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
           return true;
         }
         k++;
       }
       return false;
     };
   }