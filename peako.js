/*!
 * Copyright (c) 2017-2018 SILENT
 * Released under the MIT License.
 * Peako is a JavaScript Library.
 * https://github.com/silent-tempest/Peako
 * Based on jQuery:
 * https://github.com/jquery/jquery
 * Based on Underscore.js:
 * https://github.com/jashkenas/underscore
 * Based on Lodash:
 * https://github.com/lodash/lodash
 * Code below could be confusing!
 */

/* jshint esversion: 3, unused: true, undef: true */
/* global XMLHttpRequest, Element, FileReader, Blob, FormData, ArrayBuffer */

;( function ( window, undefined ) {

'use strict';

var document = window.document,
    console = window.console,
    body = document.body || document.createElement( 'body' ),
    obj = Object.prototype,
    str = String.prototype,
    arr = Array.prototype,
    fn = Function.prototype,
    hasOwnProperty = obj.hasOwnProperty,
    isPrototypeOf = obj.isPrototypeOf,
    toString = obj.toString,
    arr_concat = arr.concat,
    arr_slice = arr.slice,
    arr_push = arr.push,
    fn_call = fn.call,
    math_floor = Math.floor,
    math_round = Math.round,
    math_ceil = Math.ceil,
    rand = Math.random,
    max = Math.max,
    min = Math.min,
    pow = Math.pow,
    ERR_INVALID_ARGS = 'Invalid arguments',
    ERR_FUNCTION_EXPECTED = 'Expected a function',
    ERR_STRING_EXPECTED = 'Expected a string',
    ERR_UNDEFINED_OR_NULL = 'Cannot convert undefined or null to object',
    ERR_REDUCE_OF_EMPTY_ARRAY = 'Reduce of empty array with no initial value';

var regexps = {
  selector: /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/,
  property: /(^|\.)\s*([_a-z]\w*)\s*|\[\s*(\d+|\d*\.\d+|("|')(([^\\]\\(\\\\)*|[^\4])*)\4)\s*\]/gi,
  deep_key: /(^|[^\\])(\\\\)*(\.|\[)/,
  single_tag: /^(<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/,
  not_spaces: /[^\s\uFEFF\xA0]+/g
};

var support = {};

/**
 * Binds the function to `context`. Bound function
 * will execute faster than if it was bound by
 * `_.bind()`. NOTE: In the `_.bindFast()` method
 * you can't use partial arguments.
 *
 * @memberOf _
 * @static
 * @param {Function} target The function that should be bound.
 * @param {*} context The `this` value in the bound function.
 * @returns {Function} A function bound to the `context`.
 * @example
 *
 * var hello = function () {
 *   alert( this.greeting );
 * };
 *
 * var goodbye = _.bindFast( hello, {
 *   greeting: 'goodbye.'
 * } );
 *
 * goodbye(); // -> 'goodbye.'
 */
var bindFast = function ( target, context ) {
  if ( typeof target != 'function' ) {
    throw TypeError( ERR_FUNCTION_EXPECTED );
  }

  return function ( a, b, c, d, e, f, g, h ) {
    switch ( arguments.length ) {
      case 0: return target.call( context );
      case 1: return target.call( context, a );
      case 2: return target.call( context, a, b );
      case 3: return target.call( context, a, b, c );
      case 4: return target.call( context, a, b, c, d );
      case 5: return target.call( context, a, b, c, d, e );
      case 6: return target.call( context, a, b, c, d, e, f );
      case 7: return target.call( context, a, b, c, d, e, f, g );
      case 8: return target.call( context, a, b, c, d, e, f, g, h );
    }

    return target.apply( context, arguments );
  };
};

/* 'is' Methods */

/**
 * Returns true if `value` is an Array instance.
 *
 * @category Utility Methods
 * @method isArray
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isArray( [] ); // -> true
 * _.isArray( Array() ); // -> true
 */
var isArray = Array.isArray || function ( value ) {
  return isObjectLike( value ) && isLength( value.length ) && toString.call( value ) == '[object Array]';
};

/**
 * Returns true if `value` is array-like. String
 * and Object values with a valid `length`
 * property is array-like.
 *
 * @category Utility Methods
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isArrayLike( [] ); // -> true
 * _.isArrayLike( _( window ) ); // -> true
 * _.isArrayLike( new Float32Array() ); // -> true
 */
var isArrayLike = function ( value ) {
  if ( value == null ) {
    return false;
  }

  if ( typeof value == 'object' ) {
    return isLength( value.length ) && !isWindowLike( value );
  }

  return typeof value == 'string';
};

/**
 * Returns true if `value` is an object and array-like.
 *
 * @category Utility Methods
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isArrayLikeObject( [] ); // -> true
 * _.isArrayLikeObject( '' ); // -> false
 * _.isArrayLikeObject( new String() ); // -> true
 */
var isArrayLikeObject = function ( value ) {
  return isObjectLike( value ) && isLength( value.length ) && !isWindowLike( value );
};

/**
 * Returns true if `value` is a boolean primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isBoolean( false );
 * // -> true
 * _.isBoolean( new Boolean() );
 * // -> false (in older versions - true)
 */
var isBoolean = function ( value ) {
  return typeof value == 'boolean';
};

/**
 * Returns true if `value` is a finite number primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isFinite( new Number() );
 * // -> false (in older versions - true)
 * _.isFinite( Infinity );
 * // -> false
 * _.isFinite( NaN );
 * // -> false
 */
var isFinite = function ( value ) {
  return isNumber( value ) && window.isFinite( value );
};

/**
 * Returns true for all kinds of `function`.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isFunction( () => {} );
 * // -> true
 * _.isFunction( async () => {} );
 * // -> true (in older versions - false)
 */
var isFunction = function ( value ) {
  return typeof value == 'function';
};

support.HTMLElement = toString.call( body ).indexOf( 'HTML' ) > 0;

/**
 * Returns true if `value` is HTMLElement instance.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isElement( document.createElement( 'span' ) ); // -> true
 * _.isElement( document.body ); // -> true
 * _.isElement( { nodeType: 1 } ); // -> false
 */
var isElement = function ( value ) {
  if ( !isElementLike( value ) ) {
    return false;
  }

  if ( support.HTMLElement ) {
    return /\[object HTML\w*Element\]/.test( toString.call( value ) );
  }

  return typeof ( value = value.nodeName ) == 'string' && /^[A-Z]+$/.test( value );
};

/**
 * Returns true if `value` is HTMLElement instance, but faster than `_.isElement()`.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isElementLike( document.createElement( 'span' ) ); // -> true
 * _.isElementLike( document.body ); // -> true
 * _.isElementLike( { nodeType: 1 } ); // -> true
 */
var isElementLike = function ( value ) {
  return ( support.HTMLElement ? isObjectLike : isObject )( value ) && value.nodeType === 1;
};

/**
 * Returns true if `value` is a valid array-like index.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @param {Number} [length=Number.MAX_SAFE_INTEGER] Check for an array with a specific length.
 * @returns {Boolean}
 * @example
 *
 * // Without `length` parameter.
 * _.isIndex( 0 ); // -> true
 * _.isIndex( -1 ); // -> false
 * _.isIndex( 0.1 ); // -> false
 * _.isIndex( Infinity ); // -> false
 * _.isIndex( new Number() ); // -> false
 * // Using second parameter.
 * var names = [ 'Josh', 'Jared' ];
 * _.isIndex( 1, names.length ); // -> true
 * _.isIndex( 10, names.length ); // -> false
 */
var isIndex = function ( value, length, guard ) {
  if ( guard || length === undefined ) {
    length = MAX_SAFE_INT;
  }

  return !!length &&
    typeof value == 'number' &&
    value > -1 &&
    value < length &&
    value % 1 === 0;
};

var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Returns true if `value` is a valid Array instance length.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isLength( 0 ); // -> true
 * _.isLength( -0.1 ); // -> false
 * _.isLength( new Number() ); // -> false
 */
var isLength = function ( value ) {
  return typeof value == 'number' &&
    value >= 0 &&
    value <= MAX_ARRAY_LENGTH &&
    value % 1 === 0;
};

/**
 * Checks if `value` is NaN.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isNaN( NaN );
 * // -> true
 * _.isNaN( new Number( NaN ) );
 * // -> false (in older versions - true)
 */
var isNaN = function ( value ) {
  return value !== value;
};

/**
 * Returns true if `value` is a number primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isNumber( 0 );
 * // -> true
 * _.isNumber( NaN );
 * // -> true
 * _.isNumber( new Number( Infinity ) );
 * // -> false (in older versions - true)
 */
var isNumber = function ( value ) {
  return typeof value == 'number';
};

/**
 * Returns true if `value` is an Object instance.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isObject( {} ); // -> true
 * _.isObject( [] ); // -> false
 * _.isObject( new function () {} ); // -> true
 */
var isObject = function ( value ) {
  return isObjectLike( value ) &&
    toString.call( value ) == '[object Object]';
};

/**
 * Returns true if `value` is object-like.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isObjectLike( {} ); // -> true
 * _.isObjectLike( [] ); // -> true (in `_.isObject()` - false)
 * _.isObjectLike( new function () {} ); // -> true
 */
var isObjectLike = function ( value ) {
  return !!value && typeof value == 'object';
};

var fnToString = fn.toString,
    fnObject = fnToString.call( Object );

/**
 * Returns true if `value` is a plain object.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isPlainObject( {} ); // -> true
 * _.isPlainObject( [] ); // -> false
 * _.isPlainObject( new function () {} ); // -> false
 */
var isPlainObject = function ( value ) {
  var prototype;

  if ( !isObject( value ) ) {
    return false;
  }

  prototype = getPrototypeOf( value );

  return prototype === null ||
    hasOwnProperty.call( prototype, 'constructor' ) &&
    fnToString.call( prototype.constructor ) == fnObject; // Weird expression
};

/**
 * Returns true if `value` is a primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isPrimitive( null ); // -> true
 * _.isPrimitive( Symbol() ); // -> true
 * _.isPrimitive( new Boolean() ); // -> false
 */
var isPrimitive = function ( value ) {
  return !value ||
    typeof value != 'object' &&
    typeof value != 'function';
};

var MAX_SAFE_INT = 9007199254740991,
    MIN_SAFE_INT = -MAX_SAFE_INT;

/**
 * Returns true if `value` is a safe integer primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isSafeInteger( new Number() );
 * // -> false (in older versions - true)
 * _.isSafeInteger( Number.MIN_SAFE_INTEGER );
 * // -> true
 * _.isSafeInteger( Number.MIN_VALUE );
 * // -> false
 */
var isSafeInteger = function ( value ) {
  return isFinite( value ) &&
    value <= MAX_SAFE_INT &&
    value >= MIN_SAFE_INT &&
    value % 1 === 0;
};

/**
 * Returns true if `value` represents a DOM element.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isDOMElement( window ); // -> true
 * _.isDOMElement( document ); // -> true
 * _.isDOMElement( document.body ); // -> true
 * _.isDOMElement( document.createTextNode( '' ) ); // -> true
 */
var isDOMElement = function ( value ) {
  var nodeType;

  if ( !isObjectLike( value ) ) {
    return false;
  }

  if ( isWindowLike( value ) ) {
    return true;
  }

  nodeType = value.nodeType;

  return nodeType === 1 || // ELEMENT_NODE
         nodeType === 3 || // TEXT_NODE
         nodeType === 8 || // COMMENT_NODE
         nodeType === 9 || // DOCUMENT_NODE
         nodeType === 11;  // DOCUMENT_FRAGMENT_NODE
};

/**
 * Returns true if `value` represents a string primitive.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isString( '' );
 * // -> true
 * _.isString( new String() );
 * // -> false (in older versions - true)
 */
var isString = function ( value ) {
  return typeof value == 'string';
};

/**
 * Returns true if `value` represents a symbol primitive or object.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isSymbol( Symbol() ); // -> true
 * _.isSymbol( Object( Symbol() ) ); // -> true
 */
var isSymbol = function ( value ) {
  // disable "Invalid typeof value 'symbol' (W122)" (esversion: 3)
  // jshint -W122
  if ( typeof value == 'symbol' ) {
  // jshint +W122
    return true;
  }

  return value != null &&
    typeof value == 'object' &&
    toString.call( value ) == '[object Symbol]';
};

/**
 * Returns true if `value` represents a Window instance.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isWindow( window ); // -> true
 * _.isWindow( new function () { this.window = this; } ) // -> false
 */
var isWindow = function ( value ) {
  return isWindowLike( value ) && toString.call( value ) == '[object Window]';
};

/*
 * Returns true if `value` represents a Window instance, faster than `_.isWindow()`.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @returns {Boolean}
 * @example
 *
 * _.isWindowLike( window ); // -> true
 * _.isWindowLike( new function () { this.window = this; } ) // -> true
 */
var isWindowLike = function ( value ) {
  return isObjectLike( value ) && value.window === value;
};

/* Private 'base' Methods */

/**
 * Copies elements from the `source` array to the `target` array.
 */
var baseCopyArray = function ( target, source ) {
  for ( var i = source.length - 1; i >= 0; --i ) {
    target[ i ] = source[ i ];
  }

  return target;
};

/**
 * Returns or set and returns a value of `path`.
 */

// var nested = {};
//
// baseAccessor(
//   nested,
//   toPath( 'one.two' ),
//   0, // offset from right
//   2, // value to set
//   true ); // we want to set the value
// // -> 2

/**
 * nested mutated into:
 * { one: { two: 2 } }
 */

var baseAccessor = function ( object, path, offset, value, setValue ) {
  var i = 0,
      len = path.length - offset,
      key, hasPath, last;

  if ( setValue ) {
    last = len - 1;
  }

  for ( ; i < len; ++i ) {
    hasPath = has( key = path[ i ], object );

    if ( setValue ) {
      object = i === last ?
        object[ key ] = value : hasPath ?
        object[ key ] : object[ key ] = {};
    } else if ( hasPath ) {
      object = object[ key ];
    } else {
      return;
    }
  }

  return object;
};

// var object = {};
// var expander = [ 2, 1, 3 ];
// var keys = getKeys( expander ); // -> [ '0', '1', '2' ]
// baseAssign( object, expander, keys );

/**
 * object is:
 * {
 *   '0': 2,
 *   '1': 1,
 *   '2': 3
 * }
 */

var baseAssign = function ( object, expander, keys ) {
  var i = 0,
      length = keys.length;

  for ( ; i < length; ++i ) {
    object[ keys[ i ] ] = expander[ keys[ i ] ];
  }

  return object;
};

/**
 * Polyfill for `Function.prototype.bind()`.
 */
var fn_bind = fn.bind || function ( context ) {
  var partial_args = arguments.length > 2 && arr_slice.call( arguments, 2 ),
      target = this;

  return partial_args ? function () {
    return apply( target, context, partial_args.concat( arr_slice.call( arguments ) ) );
  } : function () {
    return apply( target, context, arguments );
  };
};

/**
 * Copies array-like `iterable`.
 */
var baseCloneArray = function ( iterable ) {
  var i = iterable.length,
      clone = Array( i-- );

  for ( ; i >= 0; --i ) {
    if ( has( i, iterable ) ) {
      clone[ i ] = iterable[ i ];
    }
  }

  return clone;
};

/**
 * There are three possible values for `support.defineProperty`:
 * 0 - not supported.
 * 1 - works only with DOM elements (old IE).
 * 2 - full support.
 */
support.defineProperty = function () {
  var test = function ( target ) {
    try {
      if ( '' in Object.defineProperty( target, '', {} ) ) {
        return 1;
      }
    } catch ( e ) {}

    return 0;
  };

  return test( document.createElement( 'span' ) ) + test( {} );
}();

support.defineGetter = '__defineGetter__' in obj;

/**
 * Base implementation of `Object.defineProperty()` polyfill.
 */
if ( support.defineProperty !== 2 ) {
  var baseDefineProperty = function ( object, key, descriptor ) {
    var hasGetter = has( 'get', descriptor ),
        hasSetter = has( 'set', descriptor ),
        get, set;

    if ( hasGetter || hasSetter ) {
      if ( hasGetter && typeof ( get = descriptor.get ) != 'function' ) {
        throw TypeError( 'Getter must be a function: ' + get );
      }

      if ( hasSetter && typeof ( set = descriptor.set ) != 'function' ) {
        throw TypeError( 'Setter must be a function: ' + set );
      }

      if ( has( 'writable', descriptor ) ) {
        throw TypeError( 'Invalid property descriptor.' +
          ' Cannot both specify accessors and a value or writable attribute' );
      }

      if ( support.defineGetter ) {
        if ( hasGetter ) {
          defineGetter.call( object, key, get );
        }

        if ( hasSetter ) {
          defineSetter.call( object, key, set );
        }
      } else {
        throw Error( "Can't define setter/getter" );
      }
    } else if ( has( 'value', descriptor ) || !has( key, object ) ) {
      object[ key ] = descriptor.value;
    }

    return object;
  };

  if ( support.defineGetter ) {
    var defineGetter = obj.__defineGetter__,
        defineSetter = obj.__defineSetter__;
  }
}

/**
 * Filters the `iterable` array, leaving only
 * those elements for which the `iteratee`
 * function returns true. It creates a new array!
 */

// var values = [ 0, '1', '2', 3 ];
//
// var numbers = baseFilter(
//   values, // iterable to filter
//   isNumber, // iteratee
//   null, // context for iteratee
//   false ); // invert iteratee return value (for reject)
// // -> [ 0, 3 ]

var baseFilter = function ( iterable, iteratee, context, not ) {
  var i = 0,
      length = getLength( iterable ),
      filtered = [],
      value;

  for ( ; i < length; ++i ) {
    value = iterable[ i ];

    if ( has( i, iterable ) &&
      iteratee.call( context, value, i, iterable ) != not )
    {
      filtered.push( value );
    }
  }

  return filtered;
};

/**
 * Filters the `object`, leaving only those
 * elements for which the `iteratee` function
 * returns true. It creates a new object!
 */

// var weirdData = {
//   zero: 0,
//   one: '1',
//   two: 2
// };
//
// var weirdIteratee = function ( value, key, object ) {
//   return key.length > 3 || typeof value != this;
// };
//
// var values = baseFilterObject(
//   weirdData, // object to filter
//   weirdIteratee, // iteratee
//   'number', // `this` in iteratee
//   getKeys( weirdData ),
//   true ); // invert iteratee return value (for reject)
// // -> { two: 2 }

var baseFilterObject = function ( object, iteratee, context, keys, not ) {
  var i = 0,
      length = keys.length,
      filtered = {},
      value, key;

  for ( ; i < length; ++i ) {
    value = object[ key = keys[ i ] ];

    if ( iteratee.call( context, value, key, object ) != not ) {
      filtered[ key ] = value;
    }
  }

  return filtered;
};

/**
 * Flattens a multidimensional array into a less
 * multidimensional array.
 * Taken from someone, but I do not remember from whom (sorry).
 */

// var confusingArray = [ [ [ [ [ [ 'array' ] ] ] ] ] ];
// baseFlatten( confusingArray, [], Infinity ); // -> [ 'array' ]
// baseFlatten( confusingArray, [], 6 - 2 ); // -> [ [ 'array' ] ]

var baseFlatten = function ( iterable, temp, depth ) {
  var i = 0,
      length = iterable.length,
      value;

  for ( ; i < length; ++i ) {
    if ( !has( i, iterable ) ) {
      continue;
    }

    value = iterable[ i ];

    if ( depth > 0 && isArrayLikeObject( value ) ) {
      baseFlatten( value, temp, depth - 1 );
    } else {
      temp.push( value );
    }
  }

  return temp;
};

/**
 * Calls `iteratee` with `context` for each element in `iterable`.
 */
var baseForEach = function ( iterable, iteratee, context, fromRight ) {
  var i = -1,
      j = getLength( iterable ) + i,
      index;

  for ( ; j >= 0; --j ) {
    index = fromRight ? j : ++i;

    if ( has( index, iterable ) &&
      iteratee.call( context, iterable[ index ], index, iterable ) === false )
    {
      break;
    }
  }

  return iterable;
};

/**
 * Calls `iteratee` with `context` for each `keys` in `object`.
 */
var baseForIn = function ( object, iteratee, context, keys, fromRight ) {
  var i = -1,
      j = keys.length + i,
      key;

  for ( ; j >= 0; --j ) {
    key = keys[ fromRight ? j : ++i ];

    if ( iteratee.call( context, object[ key ], key, object ) === false ) {
      break;
    }
  }

  return object;
};

support.indexOf = !!arr.indexOf;
support.lastIndexOf = !!arr.lastIndexOf;

/**
 * Returns the first (or last) position of the
 * found `search` element in the `iterable`
 * array. Unlike the standard implementation
 * of ES5, this method can find NaN.
 */
var baseIndexOf = function ( iterable, search, fromIndex, fromRight ) {
  if ( support.indexOf && search === search ) {
    if ( !fromRight ) {
      return arr.indexOf.call( iterable, search, fromIndex );
    }

    if ( support.lastIndexOf ) {
      return arr.lastIndexOf.call( iterable, search, fromIndex );
    }
  }

  var length = getLength( iterable ),
      i = -1,
      j = length - 1,
      index, value;

  if ( !length ) {
    return -1;
  }

  if ( fromIndex !== undefined ) {
    fromIndex = baseToIndex( fromIndex, length );

    i += j = fromRight ?
      min( j, fromIndex ) :
      max( 0, fromIndex );
  }

  for ( ; j >= 0; --j ) {
    index = fromRight ? j : ++i;
    value = iterable[ index ];

    if ( value === search || value !== value && search !== search ) {
      return index;
    }
  }

  return -1;
};

/**
 * Creates a new object with keys from `object`
 * values ​​and values ​​from `object` keys.
 */

// baseInvert( { a: 1, b: 2 } );
// // -> { 1: 'a', 2: 'b' }

var baseInvert = function ( object, keys ) {
  var inverted = {},
      i = keys.length - 1,
      key;

  for ( ; i >= 0; --i ) {
    inverted[ key = keys[ i ] ] = object[ key ];
  }

  return inverted;
};

support.keys = Object.keys ?
  2 : { toString: null }.propertyIsEnumerable( 'toString' ) ?
  1 : 0;

/**
 * Base implementation of `Object.keys` polyfill.
 */
if ( support.keys !== 2 ) {
  if ( !support.keys ) {
    var non_enums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];

    var fix_keys = function ( keys, object ) {
      var i = non_enums.length - 1,
          key;

      for ( ; i >= 0; --i ) {
        key = non_enums[ i ];

        if ( baseIndexOf( keys, key, undefined, true ) < 0 &&
          hasOwnProperty.call( object, key ) )
        {
          keys.push( key );
        }
      }

      return keys;
    };
  }

  var baseKeys = function ( object ) {
    var keys = [],
        key;

    for ( key in object ) {
      if ( hasOwnProperty.call( object, key ) ) {
        keys.push( key );
      }
    }

    if ( support.keys ) {
      return keys;
    }

    return fix_keys( keys, object );
  };
}

/**
 * Base implementation of `_.map` and `_mapRight` (works only with array-like objects).
 * `_.mapRight()` reverses the array, but doesn't loop through it reversibly!
 */
var baseMap = function ( iterable, iteratee, context, fromRight ) {
  var length, result, j, i;

  if ( !fromRight && arr.map ) {
    return arr.map.call( iterable, iteratee, context );
  }

  result = Array( j = length = getLength( iterable ) );

  for ( i = 0; i < length; ++i ) {
    if ( has( i, iterable ) ) {
      result[ fromRight ? --j : i ] = iteratee
        .call( context, iterable[ i ], i, iterable );
    }
  }

  return result;
};

/**
 * Base implementation of `_.map` (works not only with array-like objects).
 */

// var User = function ( name, age ) {
//   this.name = name;
//   this.age = age;
// };
//
// User.getAge = function ( user ) {
//   return user.age;
// };
//
// var users = {
//   Josh: new User( 'Josh', 1243 ),
//   JSON: new User( 'JSON', -Infinity )
// };
//
// var ages = baseMapObject(
//   users, // object to map
//   User.getAge, // iteratee
//   null, // context for iteratee
//   getKeys( users ) ); // properties to map in object
// // -> { Josh: 1243, JSON: -1 }

var baseMapObject = function ( object, iteratee, context, keys ) {
  var length = keys.length,
      result = {},
      i = 0,
      key;

  for ( ; i < length; ++i ) {
    result[ key = keys[ i ] ] = iteratee
      .call( context, object[ key ], key, object );
  }

  return result;
};

/**
 * Merges the `iterable` array with the `expander` array.
 */

// var iterable = [ 'flowers', 'john' ];
// var expander = [ 'numbers', 'universe' ];
// baseMerge( iterable, expander );
// // -> [ 'flowers', 'john', 'numbers', 'universe' ]

var baseMerge = function ( iterable, expander ) {
  var i = 0,
      length = expander.length;

  for ( ; i < length; ++i ) {
    if ( has( i, expander ) ) {
      arr_push.call( iterable, expander[ i ] );
    }
  }

  return iterable;
};

/**
 * Base implementation of `_.range` and `_.rangeRight`.
 * Returns an array with a range of numbers
 * from `start` to` end` with the `step`.
 */

// baseRange( false, 0, 5, 2 )
// // -> [ 0, 2, 4 ] (Probably. I do not know)

var baseRange = function ( reverse, start, end, step ) {
  var i = -1,
      j = math_ceil( ( end - start ) / step ),
      temp = Array( j-- );

  for ( ; j >= 0; --j ) {
    temp[ reverse ? j : ++i ] = start;
    start += step;
  }

  return temp;
};

/**
 * Returns random element from the `iterable` array.
 */
var baseSample = function ( iterable ) {
  return iterable[ random( 0, getLength( iterable ) - 1, false ) ];
};

/**
 * Shuffles the `iterable` array. This method mutates array!
 */
var baseShuffle = function ( iterable, size ) {
  var index = 0,
      length = getLength( iterable ),
      lastIndex = length - 1,
      randIndex, randValue;

  if ( size === undefined ) {
    size = length;
  }

  for ( ; index < size; ++index ) {
    randIndex = random( index, lastIndex, false );
    randValue = iterable[ randIndex ];
    iterable[ randIndex ] = iterable[ index ];
    iterable[ index ] = randValue;
  }

  if ( size !== length ) {
    iterable.length = size;
  }

  return iterable;
};

/**
 * Executes the `callback` function
 * `times` times, and returns an array
 * with the results of its execution.
 */
var baseTimes = function ( times, callback ) {
  var i = 0,
      results = Array( times );

  for ( ; i < times; ++i ) {
    results[ i ] = callback( i );
  }

  return results;
};

/**
 * Returns a valid index for an array with
 * the `length` length from the `value`.
 */

// baseToIndex( -1, 10 ); // -> 9
// baseToIndex( -1, 0 ); // -> 0
// baseToIndex( NaN, 10 ); // -> 0

var baseToIndex = function ( value, length ) {
  if ( !length || !value ) {
    return 0;
  }

  if ( value < 0 ) {
    value += length;
  }

  return value || 0;
};

/**
 * Returns an array filled with the "[key, value]" pairs of the `object`.
 */

// baseToPairs( { a: 10, b: 20 }, [ 'a', 'b' ] );
// // -> [ [ 'a', 10 ], [ 'b', 20 ] ]

var baseToPairs = function ( object, keys ) {
  var i = keys.length,
      pairs = Array( i-- );

  for ( ; i >= 0; --i ) {
    pairs[ i ] = [ keys[ i ], object[ keys[ i ] ] ];
  }

  return pairs;
};

/**
 * Retruns values of the `object`.
 */

// baseValues( { a: 10, b: 20 }, [ 'a', 'b' ] );
// // -> [ 10, 20 ]

var baseValues = function ( object, keys ) {
  var i = keys.length,
      values = Array( i-- );

  for ( ; i >= 0; --i ) {
    values[ i ] = object[ keys[ i ] ];
  }

  return values;
};

/* Private 'create' Methods */

var createAssign = function ( getKeys ) {
  return function ( object ) {
    var i = 1,
        length = arguments.length,
        expander;

    if ( object == null ) {
      throw TypeError( ERR_UNDEFINED_OR_NULL );
    }

    for ( ; i < length; ++i ) {
      expander = arguments[ i ];

      if ( expander != null ) {
        baseAssign( object, expander, getKeys( expander ) );
      }
    }

    return object;
  };
};

var createEach = function ( fromRight ) {
  return function ( iterable, iteratee, context ) {
    iterable = toObject( iterable );
    iteratee = getIteratee( iteratee );

    return isArrayLike( iterable ) ?
      baseForEach( iterable, iteratee, context, fromRight ) :
      baseForIn( iterable, iteratee, context, getKeys( iterable ), fromRight );
  };
};

var createEverySome = function ( every ) {
  return function ( iterable, iteratee, context ) {
    iterable = getIterable( toObject( iterable ) );
    iteratee = getIteratee( iteratee );

    var i = 0,
        length = getLength( iterable );

    for ( ; i < length; ++i ) {
      if ( has( i, iterable ) && iteratee
        .call( context, iterable[ i ], i, iterable ) != every )
      {
        return !every;
      }
    }

    return every;
  };
};

var createFilter = function ( not, getKeys ) {
  return function ( iterable, iteratee, context ) {
    iteratee = getIteratee( iteratee );

    if ( isArrayLike( iterable ) ) {
      return baseFilter( iterable, iteratee, context, not );
    }

    return baseFilterObject(
      iterable = toObject( iterable ),
      iteratee,
      context,
      getKeys( iterable ),
      not );
  };
};

var createFind = function ( returnIndex, fromRight ) {
  return function ( iterable, iteratee, context ) {
    iterable = toObject( iterable );

    var i = -1,
        j = getLength( iterable ) + i,
        index, value;

    for ( ; j >= 0; --j ) {
      index = fromRight ? j : ++i;
      value = iterable[ index ];

      if ( has( index, iterable ) &&
        iteratee.call( context, value, index, iterable ) )
      {
        return returnIndex ? index : value;
      }
    }

    if ( returnIndex ) {
      return -1;
    }
  };
};

var createForEach = function ( fromRight ) {
  return function ( iterable, iteratee, context ) {
    return baseForEach(
      getIterable( toObject( iterable ) ),
      getIteratee( iteratee ),
      context,
      fromRight );
  };
};

var createForIn = function ( getKeys, fromRight ) {
  return function ( object, iteratee, context ) {
    return baseForIn(
      object = toObject( object ),
      iteratee,
      context,
      getKeys( object ),
      fromRight );
  };
};

var createIndexOf = function ( fromRight ) {
  return function ( iterable, search, fromIndex ) {
    return baseIndexOf( toObject( iterable ), search, fromIndex, fromRight );
  };
};

var createMap = function ( fromRight, getKeys ) {
  return function ( iterable, iteratee, context ) {
    iteratee = getIteratee( iteratee );

    if ( isArrayLike( iterable ) ) {
      return baseMap( iterable, iteratee, context, fromRight );
    }

    if ( fromRight ) {
      throw TypeError( "_.mapRight for non-arrays not implemented" );
    }

    return baseMapObject(
      iterable = toObject( iterable ),
      iteratee,
      context,
      getKeys( iterable ) );
  };
};

var createRange = function ( reverse ) {
  return function ( start, end, step ) {
    if ( step === undefined ) {
      if ( end === undefined ) {
        end = start;
        start = 0;
      }

      step = 1;
    }

    if ( end < start && step > 0 ) {
      step = -step;
    }

    return baseRange( reverse, start, end, step );
  };
};

var createToCaseFirst = function ( toCase ) {
  return function ( string ) {
    if ( string == null ) {
      throw TypeError( ERR_UNDEFINED_OR_NULL );
    }

    return ( string += '' ).charAt( 0 )[ toCase ]() + string.slice( 1 );
  };
};

var createToPairs = function ( getKeys ) {
  return function ( object ) {
    return baseToPairs(
      object = toObject( object ),
      getKeys( object ) );
  };
};

var createTrim = function ( regexp ) {
  return function ( target ) {
    if ( target == null ) {
      throw TypeError( ERR_UNDEFINED_OR_NULL );
    }

    return ( '' + target ).replace( regexp, '' );
  };
};

var createValues = function ( getKeys ) {
  return function ( object ) {
    return baseValues( object = toObject( object ), getKeys( object ) );
  };
};

var createRound = function ( round ) {
  return function ( value, precision, guard ) {
    if ( guard || precision === undefined /* || precision === 0 */ ) {
      return round( value );
    }

    return round( value * ( precision = pow( 10, precision ) ) ) / precision;
  };
};

/* Other Methods */

var apply = function ( target, context, args ) {
  switch ( args.length ) {
    case 0: return target.call( context );
    case 1: return target.call( context, args[ 0 ] );
    case 2: return target.call( context, args[ 0 ], args[ 1 ] );
    case 3: return target.call( context, args[ 0 ], args[ 1 ], args[ 2 ] );
  }

  return target.apply( context, args );
};

var getLength = function ( iterable ) {
  return iterable == null ? 0 : iterable.length >>> 0;
};

var toWords = function ( string ) {
  if ( typeof string != 'string' ) {
    throw TypeError( ERR_STRING_EXPECTED );
  }

  return string.match( regexps.not_spaces ) || [];
};

var toCamelCase = function () {
  var toCamelCase = function ( string, symbol ) {
    return symbol.toUpperCase();
  };

  return function ( string ) {
    return string.indexOf( '-' ) < 0 ?
      string :
      string.replace( /-(\w)/g, toCamelCase );
  };
}();

var getType = function ( value ) {
  var type;

  if ( value === null ) {
    return 'null';
  }

  if ( value === undefined ) {
    return 'undefined';
  }

  type = typeof value;

  if ( type != 'object' && type != 'function' ) {
    return type;
  }

  type = types[ type = toString.call( value ) ];

  if ( type ) {
    return type;
  }

  return ( types[ type ] = type.slice( 8, -1 ).toLowerCase() );
};

var getIteratee = function ( value ) {
  if ( typeof value == 'function' ) {
    return value;
  }

  if ( isKey( value ) ) {
    return property( value );
  }

  throw TypeError( ERR_FUNCTION_EXPECTED );
};

var getIterable = function ( value ) {
  return isString( value ) ?
    value.split( '' ) : isArrayLikeObject( value ) ?
    value : baseValues( value, getKeys( value ) );
};

var baseExec = function ( regexp, string ) {
  var result = [],
      value;

  regexp.lastIndex = 0;

  while ( ( value = regexp.exec( string ) ) ) {
    result.push( value );
  }

  return result;
};

var stringToPath = function ( string ) {
  var path = baseExec( regexps.property, string ),
      i = path.length - 1,
      value;

  for ( ; i >= 0; --i ) {
    value = path[ i ];

    // .name
    if ( value[ 2 ] ) {
      path[ i ] = value[ 2 ];

    // [ "" ] || [ '' ]
    } else if ( value[ 5 ] != null ) {
      path[ i ] = unescape( value[ 5 ] );

    // [ 0 ]
    } else {
      path[ i ] = value[ 3 ];
    }
  }

  return path;
};

var isKey = function ( value ) {
  var type;

  if ( !value ) {
    return true;
  }

  if ( isArray( value ) ) {
    return false;
  }

  type = typeof value;

  return type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ||
    !regexps.deep_key.test( value );
};

var unescape = function ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};

var toKey = function ( value ) {
  var type = getType( value ),
      key;

  if ( type == 'string' ) {
    return unescape( value );
  }

  if ( type == 'symbol' ) {
    return value;
  }

  key = '' + value;

  if ( key == '0' && 1 / value == -Infinity ) {
    return '-0';
  }

  return unescape( key );
};

var getStyle = function ( element, name, computed_style ) {
  return element.style[ name ] ||
    ( computed_style || getComputedStyle( element ) ).getPropertyValue( name );
};

var has = function ( key, object ) {
  if ( object == null ) {
    return false;
  }

  return object[ key ] !== undefined || key in object;
};

/**
 * `Date.now()` polyfill.
 *
 * @method now
 * @memberOf _
 * @static
 * @returns {Number}
 * @example
 *
 * _.now(); // -> 1518766578121
 */
var getTime = Date.now || function () {
  return new Date().getTime();
};

/**
 * Returns a function that can only be called `n`
 * times. NOTE: Behave differently from Lodash
 * `_.before()`.
 *
 * @memberOf _
 * @static
 * @param {Number} n
 * @param {Function} target
 * @returns {Function}
 * @example
 *
 * Math.weirdFunc = _.before( 2, function () {
 *   return this.floor( this.random() * 100 );
 * } );
 *
 * Math.weirdFunc(); // -> 87
 * Math.weirdFunc(); // -> 21
 * Math.weirdFunc(); // -> 21
 * Math.weirdFunc(); // -> 21...
 */
var before = function ( n, target ) {
  var value;

  if ( typeof target != 'function' ) {
    throw TypeError( ERR_FUNCTION_EXPECTED );
  }

  n = defaultTo( n, 1 );

  return function () {
    if ( target ) {
      if ( --n >= 0 ) {
        value = apply( target, this, arguments );
      }

      if ( n < 2 ) {
        target = null;
      }
    }

    return value;
  };
};

var bind = function () {
  var args = function ( partial_args, args ) {
    var i = 0,
        j = -1,
        len = partial_args.length,
        result = [],
        value;

    for ( ; i < len; ++i ) {
      value = partial_args[ i ];
      result.push( value === peako ? args[ ++j ] : value );
    }

    for ( len = args.length; j < len; ++j ) {
      result.push( args[ i ] );
    }

    return result;
  };

  /**
   * Binds the `target` function to the `context`.
   *
   * @method bind
   * @memberOf _
   * @static
   * @param {Function} target
   * @param {*} context
   * @param {...*} partialArgs
   * @returns {Function} A function bound to the `context`.
   * @example
   *
   * var greet = function ( name, end ) {
   *   alert( this.greeting + ', ' + name + end );
   * };
   *
   * _.bind( greet, { greeting: 'Hi' }, _, '!' )( 'Josh' );
   * // -> 'Hi, Josh!'
   * _.bind( greet, { greeting: 'Hello' }, 'Mike' )( '.' );
   * // -> 'Hello, Mike.'
   */
  return function bind ( target, context ) {
    var partial_args;

    if ( typeof target != 'function' ) {
      throw TypeError( ERR_FUNCTION_EXPECTED );
    }

    if ( arguments.length < 3 ) {
      return fn_bind.call( target, context );
    }

    partial_args = arr_slice.call( arguments, 2 );

    if ( indexOf( partial_args, peako ) < 0 ) {
      return fn_call.apply( fn_bind, arguments );
    }

    return function () {
      return apply( target, context, args( partial_args, arguments ) );
    };
  };
}();

/**
 * Returns a number that doesn't go out of bounds `lower` and `upper`.
 *
 * @memberOf _
 * @static
 * @param {Number} value The number to clamp.
 * @param {Number} lower The lower bound.
 * @param {Number} upper The upper bound.
 * @returns {Number} A number between the lower and upper bounds.
 * @example
 *
 * _.clamp( -5, 0, 10 ); // -> 0
 * _.clamp( 15, 0, 10 ); // -> 10
 */
var clamp = function ( value, lower, upper ) {
  if ( value >= upper ) {
    return upper;
  }

  if ( value <= lower ) {
    return lower;
  }

  return value;
};

/**
 * Creates a clone of the `target` object.
 *
 * @memberOf _
 * @static
 * @param {Boolean} [deep=true] Recursively clone the target?
 * @param {!*} target The target to clone.
 * @example
 *
 * var Person = function ( greeting ) {
 *   this.greeting = greeting;
 *   this.person = this;
 * };
 *
 * Person.prototype.greet = function () {
 *   return this.greeting;
 * };
 *
 * var person = new Person( 'Hello!' ),
 *     clone = _.clone( person );
 *
 * clone.greet(); // -> 'Hello!'
 * clone.person; // -> clone
 * clone instanceof Person; // -> true
 */
var clone = function ( deep, target, guard ) {
  var cln;

  if ( target === undefined || guard ) {
    target = deep;
    deep = true;
  }

  cln = create( getPrototypeOf( target = toObject( target ) ) );

  each( target, function ( value, key, target ) {
    if ( value === target ) {
      this[ key ] = this;
    } else if ( deep && !isPrimitive( value ) ) {
      this[ key ] = clone( deep, value );
    } else {
      this[ key ] = value;
    }
  }, cln );

  return cln;
};

/**
 * Creates an array with elements from the `iterable`
 * array. NOTE: You can use `<Array>.slice()`, but in
 * some situations `_.cloneArray()` works much faster
 * (for array-like objects).
 *
 * @memberOf _
 * @static
 * @param {Array|Object|String} iterable The array-like value to clone.
 * @returns {Array} The clone of `iterable`.
 * @example
 *
 * var weirdObject = {
 *   0: 'A',
 *   1: 'Z',
 *   length: 2
 * };
 *
 * _.cloneArray( weirdObject );
 * // -> [ 'A', 'Z' ]
 */
var cloneArray = function ( iterable ) {
  if ( iterable == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  return baseCloneArray( iterable );
};

/**
 * Returns array without falsy values.
 *
 * @memberOf _
 * @static
 * @param {Array|Object} iterable The array-like object to compact.
 * @returns {Array} A new compacted array.
 * @example
 *
 * _.compact( [ 'A', 0, null, '', 'Z' ] );
 * // -> [ 'A', 'Z' ]
 */
var compact = function ( iterable ) {
  var compacted = [],
      i = 0,
      len = iterable.length,
      value;

  for ( ; i < len; ++i ) {
    if ( ( value = iterable[ i ] ) ) {
      compacted.push( value );
    }
  }

  return compacted;
};

var constant = function ( value ) {
  return function () {
    return value;
  };
};

/**
 * Polyfill for the `Object.create()` method.
 *
 * @method create
 * @memberOf _
 * @static
 * @param {null|Object} prototype The prototype of a new object.
 * @param {Object} [descriptors]
 *   The descriptors to assign in the new object via
 *   [`_.defineProperties()`]{@link _.defineProperties}.
 * @returns {Array} A new created object with `prototype`.
 * @example
 *
 * var prototype = null;
 *
 * var descriptors = {
 *   one: {
 *     get: _.constant( 1 )
 *   }
 * };
 *
 * var object = _.create( prototype, descriptors );
 */
var create = Object.create || function () {
  var Constructor = function () {};

  return function create ( prototype, descriptors ) {
    var object;

    if ( prototype !== null && isPrimitive( prototype ) ) {
      throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
    }

    Constructor.prototype = prototype;

    object = new Constructor();

    Constructor.prototype = null;

    if ( prototype === null ) {
      setPrototypeOf( object, prototype );
    }

    if ( arguments.length >= 2 ) {
      defineProperties( object, descriptors );
    }

    return object;
  };
}();

/**
 * Returns `defaultValue` when `value` is `null`, `undefined`, or `NaN`.
 *
 * @memberOf _
 * @static
 * @param {*} value The value to check.
 * @param {*} defaultValue The default value.
 * @returns {*} Returns `value` or `defaultValue`.
 * @example
 *
 * _.defaultTo( new Number( NaN ), 0 );
 * // -> new Number( NaN )
 * _.defaultTo( NaN, 0 );
 * // -> 0
 * _.defaultTo( null, {} );
 * // -> {}
 * _.defaultTo( 0, 100 );
 * // -> 0
 */
var defaultTo = function ( value, defaultValue ) {
  if ( value != null && value === value ) {
    return value;
  }

  return defaultValue;
};

/**
 * Polyfill for the `Object.defineProperties()` method.
 *
 * @method defineProperties
 * @memberOf _
 * @static
 * @param {Object} object The object to modificate.
 * @param {Object} descriptors The descriptors to define.
 * @returns {Object} The object in which properties were defined.
 * @example
 *
 * var object = {};
 *
 * var descriptors = {
 *   one: {
 *     get: _.constant( 1 )
 *   },
 *
 *   two: {
 *     get: _.constant( 2 )
 *   },
 * };
 *
 * _.defineProperties( object, descriptors );
 */
var defineProperties = support.defineProperty === 2 ?
  Object.defineProperties :

function ( object, descriptors ) {
  if ( support.defineProperty ) {
    try {
      return Object.defineProperties( object, descriptors );
    } catch ( e ) {}
  }

  if ( isPrimitive( object ) ) {
    throw TypeError( 'defineProperties called on non-object' );
  }

  if ( isPrimitive( descriptors ) ) {
    throw TypeError( 'Property description must be an object: ' + descriptors );
  }

  each( descriptors, function ( descriptor, key ) {
    if ( isPrimitive( descriptor ) ) {
      throw TypeError( 'Property description must be an object: ' + descriptor );
    }

    baseDefineProperty( this, key, descriptor );
  }, object );

  return object;
};

/**
 * Polyfill for the `Object.defineProperty()` method.
 *
 * @method defineProperty
 * @memberOf _
 * @static
 * @param {Object} object The object to modificate.
 * @param {String} key The key of defined property.
 * @param {Object} descriptor The descriptor to define.
 * @returns {Object} The object in which property were defined.
 * @example
 *
 * var person = {};
 *
 * var descriptors = {
 *   value: 'Josh'
 * };
 *
 * _.defineProperty( person, 'name', descriptor );
 */
var defineProperty = support.defineProperty === 2 ?
  Object.defineProperty :

function ( object, key, descriptor ) {
  if ( support.defineProperty ) {
    try {
      return Object.defineProperty( object, key, descriptor );
    } catch ( e ) {}
  }

  if ( isPrimitive( object ) ) {
    throw TypeError( 'defineProperty called on non-object' );
  }

  if ( isPrimitive( descriptor ) ) {
    throw TypeError( 'Property description must be an object: ' + descriptor );
  }

  return baseDefineProperty( object, key, descriptor );
};

var equal = function ( a, b ) {
  return a === b || a !== a && b !== b;
};

/**
 * It's like `<RegExp>.exec()`, but it works as
 * `<String>.match()` with the global flag.
 *
 * @method exec
 * @memberOf _
 * @static
 * @param {RegExp} regexp
 * @param {String} string
 * @returns {Array}
 * @example
 *
 * _.exec( /f(o){2}/g, 'foobarfoo' );
 * // -> [ [ 'foo', 'o' ], [ 'foo', 'o' ] ]
 */
var exec = function ( regexp, string ) {
  if ( regexp.global ) {
    return baseExec( regexp, '' + string );
  }

  return regexp.exec( string );
};

var defaultIndex = function ( value, length, defaultValue ) {
  if ( value !== undefined ) {
    return toIndex( value, length );
  }

  return defaultValue;
};

/**
 * Fill the `iterable` array from `start` to `end` index with `value`.
 */

// _.fill( Array( 5 ), 0 );
// // -> [ 0, 0, 0, 0, 0 ]
// _.fill( [ 'a', null, null, null, 'z' ], '.', 1, -1 );
// // -> [ 'a', '.', '.', '.', 'z' ]

var fill = function ( iterable, value, start, end ) {
  var length = getLength( iterable = toObject( iterable ) );

  start = defaultIndex( start, length, 0 );
  end = defaultIndex( end, length, length );

  for ( ; start < end; ++start ) {
    iterable[ start ] = value;
  }

  return iterable;
};

/**
 * Flattens the `iterable` array by reduce the number of
 * dimensions in it on `depth` value (default - Infinity).
 */

// var weirdArray = [
//   [ [ "I'm in the array!" ] ]
// ];
//
// _.flatten( weirdArray );
// // -> [ "I'm in the array!" ];
// _.flatten( weirdArray, 1 );
// // -> [ [ "I'm in the array!" ] ];

var flatten = function ( iterable, depth ) {
  return baseFlatten( toObject( iterable ), [], defaultTo( depth, Infinity ) );
};

/**
 * Makes an object from the pairs (see `_.toPairs()`).
 */

// _.fromPairs( [
//   [ 'name', 'Josh' ]
// ] );
// // -> { name: 'Josh' }
//
// _.fromPairs( _.toPairs( { one: 1 } ) );
// // -> { one: 1 }

var fromPairs = function ( pairs ) {
  var i = 0,
      length = pairs.length,
      object = {};

  for ( ; i < length; ++i ) {
    object[ pairs[ i ][ 0 ] ] = pairs[ i ][ 1 ];
  }

  return object;
};

/**
 * Polyfill for the `perfomance.now()` method.
 */
var timestamp = function () {
  var perfomance = window.perfomance,
      navigatorStart;

  if ( perfomance ) {
    if ( perfomance.now ) {
      return perfomance.now;
    }

    navigatorStart = perfomance.timing &&
      perfomance.timing.navigatorStart;
  }

  if ( !navigatorStart ) {
    navigatorStart = getTime();
  }

  return function () {
    return getTime() - navigatorStart;
  };
}();

var toPath = function ( value ) {
  var parsed, len, i;

  if ( isKey( value ) ) {
    return [ toKey( value ) ];
  }

  if ( isArray( value ) ) {
    parsed = Array( len = value.length );

    for ( i = len - 1; i >= 0; --i ) {
      parsed[ i ] = toKey( value[ i ] );
    }
  } else {
    parsed = stringToPath( '' + value );
  }

  return parsed;
};

/**
 * Returns the value at path of the object. If the
 * third argument passed, it will be set to the path,
 * if the path doesn't exists, it will be created.
 */

// var object = {},
//     path = '[ 0 ][ "1" ][ \'2\' ].three';
//
// _.access( object, path, 3 );
// // -> 3
// _.access( object, path );
// // -> 3

var accessor = function ( object, path, value ) {
  var len = ( path = toPath( path ) ).length,
      setValue = arguments.length > 2;

  object = toObject( object );

  if ( len ) {
    return len > 1 ?
      baseAccessor( object, path, 0, value, setValue ) : setValue ?
      object[ path[ 0 ] ] = value :
      object[ path[ 0 ] ];
  }
};

var default_file_options = {
  onerror: function () {
    throw Error();
  },

  timeout: 6e4
};

/**
 * This function will be called when the file is
 * loaded successfully. `this` in this functios
 * will point to the <XMLHttpRequest> object
 * that was used to load the file.
 * @callback FileLoadedCallback
 * @param {String} data The content of the loaded file.
 * @param {String} path The path of the loaded file.
 * @param {FileOptions} options The options that given into the `_.file()` method.
 */

/**
 * This function will be called when the error
 * occur while loading the file. `this` in this
 * functios will point to the <XMLHttpRequest>
 * object that was used to load the file.
 * @callback LoadingFileErrorCallback
 * @param {String} path The path of the file that failed to load.
 * @param {FileOptions} options The options that given into the `_.file()` method.
 */

/**
 * This options used in [`_.file()`]{@link _.file}.
 * @typedef FileOptions
 * @type {Object}
 * @property {String} [path]
 *   The path of the file to be loaded.
 * @property {Boolean} [async]
 *   Use an asynchronous request?
 * @property {FileLoadedCallback} [onload]
 *   This function will be called when the file
 *   is loaded successfully.
 * @property {LoadingFileErrorCallback} [onerror]
 *   This function will be called when the error
 *   occur while loading the file.
 * @property {Number} [timeout=60000]
 *   If the load time for the file needs more
 *   than this limit, it will be canceled.
 */

/**
 * Returns the contents of the file at the path.
 *
 * @memberOf _
 * @static
 *
 * @param {String} [path]
 *   The path of the file to be loaded.
 * @param {FileOptions} [options]
 *   File load options.
 * @returns {null|String}
 *   When the request wasn't asynchronous, it
 *   returns the contents of the file.
 *
 * @example
 *
 * // Use cases:
 *
 * // 1. async = false
 * _.file( path );
 * // 2. async = options.async || true
 * _.file( path, options );
 * // 3. async = options.async || true
 * _.file( options );
 */
var file = function ( path, options ) {

  var data = null,
      use_async, request, id;

  // _.file( options );
  // async = options.async || true
  if ( typeof path != 'string' ) {
    options = defaults( default_file_options, path );
    use_async = options.async === undefined || options.async;
    path = options.path;

  // _.file( path );
  // async = false
  } else if ( options === undefined ) {
    options = default_file_options;
    use_async = false;

  // _.file( path, options );
  // async = options.async || true
  } else {
    options = defaults( default_file_options, options );
    use_async = options.async === undefined || options.async;
  }

  request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if ( this.readyState !== 4 ) {
      return;
    }

    if ( this.status === 200 ) {
      if ( id !== undefined ) {
        window.clearTimeout( id );
      }

      data = this.responseText;

      if ( options.onload ) {
        options.onload.call( this, data, path, options );
      }
    } else if ( options.onerror ) {
      options.onerror.call( this, path, options );
    }
  };

  request.open( 'GET', path, use_async );

  if ( use_async ) {
    id = window.setTimeout( function () {
      request.abort();
    }, options.timeout );
  }

  request.send();

  return data;

};

/**
 * The `Object.getPrototypeOf()` polyfill.
 */
var getPrototypeOf = Object.getPrototypeOf || function ( target ) {
  var prototype, constructor;

  if ( target == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  // jshint proto: true
  prototype = target.__proto__;
  // jshint proto: false

  if ( prototype !== undefined ) {
    return prototype;
  }

  constructor = target.constructor;

  return getType( constructor ) == 'function' ?
    constructor.prototype : obj;
};

var identity = function ( value ) {
  return value;
};

/**
 * Returns true when the object contains the value (see `Array.prototype.includes()`).
 */

// _.includes( [ 0, NaN, 2 ], NaN ); // -> true
// _.includes( { z: 'A', A: 'z' }, 'z' ); // -> true
// _.includes( 'abcdef', 'b' ); // -> true

var includes = function ( object, value ) {
  if ( typeof object == 'string' ) {
    return object.indexOf( value ) >= 0;
  }

  if ( !isArrayLikeObject( object ) ) {
    object = getValues( object );
  }

  return indexOf( object, value ) >= 0;
};

/**
 * Creates an object whose keys and values ​​are inverted.
 */

// _.invert( { one: 1, two: 2 } );
// // -> { 1: 'one', 2: 'two' }

var invert = function ( target ) {
  return baseInvert( target = toObject( target ), getKeys( target ) );
};

/**
 * The ES5 `Object.keys()` polyfill.
 */

// var object = {
//   a: 'b',
//   b: 'c'
// };
//
// object.constructor.prototype.c = 'a';
// _.keys( object ); // -> [ 'a', 'b' ]

var getKeys = support.keys !== 2 ? function ( object ) {
  return baseKeys( toObject( object ) );
} : Object.keys;

/**
 * Same as `_.keys()`, but also includes the names of inherited properties.
 */

// var object = {
//   a: 'b',
//   b: 'c'
// };
//
// object.constructor.prototype.c = 'a';
// _.keys( object ); // -> [ 'a', 'b', 'c' ]

var getKeysIn = function ( target ) {
  var keys = [],
      key;

  target = toObject( target );

  for ( key in target ) {
    keys.push( key );
  }

  return keys;
};

/**
 * Merges the `iterable` array with the values after it.
 */

// _.merge( [ 0, 1 ], 2, [ 3, 4 ] );
// // -> [ 0, 1, 2, 3, 4 ]

var merge = function ( iterable ) {
  var i = 1,
      length = arguments.length,
      expander;

  iterable = toObject( iterable );

  for ( ; i < length; ++i ) {
    expander = arguments[ i ];

    if ( isArrayLikeObject( expander ) ) {
      baseMerge( iterable, expander );
    } else {
      arr_push.call( iterable, expander );
    }
  }

  return iterable;
};

// _.forEach( shapes, _.method( 'draw' ) );

var method = function ( path ) {
  var len = ( path = toPath( path ) ).length,
      args = slice.call( arguments, 1 ),
      key;

  if ( !len ) {
    throw Error( 'An empty _.method() path' );
  }

  return len > 1 ? ( key = path[ path.length - 1 ], function ( object ) {
    if ( object != null && ( object = baseAccessor( object, path, 1 ) ) != null ) {
      return apply( object[ key ], object, args );
    }
  } ) : function ( object ) {
    if ( object != null ) {
      return apply( object[ path ], object, args );
    }
  };
};

var mixin = function ( deep, target ) {
  var nowArray = false,
      i = 2,
      length = arguments.length,
      expander, source, keys, key, value, j, k;

  if ( !isBoolean( deep ) ) {
    target = deep;
    deep = true;
    --i;
  }

  if ( i === length ) {
    target = this;
    --i;
  }

  target = toObject( target );

  for ( ; i < length; ++i ) {
    keys = getKeys( expander = toObject( arguments[ i ] ) );

    for ( j = 0, k = keys.length; j < k; ++j ) {
      value = expander[ key = keys[ j ] ];

      if ( deep && value !== expander &&
        ( isPlainObject( value ) || ( nowArray = isArray( value ) ) ) )
      {
        source = target[ key ];

        if ( nowArray ) {
          nowArray = false;

          if ( !isArray( source ) ) {
            source = [];
          }
        } else if ( !isPlainObject( source ) ) {
          source = {};
        }

        target[ key ] = mixin( deep, source, value );
      } else {
        target[ key ] = value;
      }
    }
  }

  return target;
};

var __ = window._,
    _peako = window.peako;

var noConflict = function ( returnAll ) {
  if ( window._ === peako ) {
    window._ = __;
  }

  if ( returnAll && window.peako === peako ) {
    window.peako = _peako;
  }

  return peako;
};

var noop = function () {};

var nth = function ( iterable, index ) {
  var length = getLength( iterable );

  if ( !length ) {
    return;
  }

  index = baseToIndex( index, length );

  if ( isIndex( index, length ) ) {
    return iterable[ index ];
  }
};

var last = function ( iterable ) {
  return nth( iterable, -1 );
};

var nthArg = function ( index ) {
  return function ( argument ) {
    return index ? nth( arguments, index ) : argument;
  };
};

var once = function ( target ) {
  return before( 1, target );
};

var property = function ( path ) {
  var len = ( path = toPath( path ) ).length;

  return len > 1 ? function ( object ) {
    if ( object != null ) {
      return baseAccessor( object, path, 0 );
    }
  } : len ? function ( object ) {
    if ( object != null ) {
      return object[ path ];
    }
  } : noop;
};

var random = function ( lower, upper, floating ) {
  // _.random();
  if ( lower === undefined ) {
    floating = false;
    upper = 1;
    lower = 0;
  } else if ( upper === undefined ) {
    // _.random( floating );
    if ( typeof lower == 'boolean' ) {
      floating = lower;
      upper = 1;

    // _.random( upper );
    } else {
      floating = false;
      upper = lower;
    }

    lower = 0;
  } else if ( floating === undefined ) {
    // _.random( upper, floating );
    if ( typeof upper == 'boolean' ) {
      floating = upper;
      upper = lower;
      lower = 0;

    // _.random( lower, upper );
    } else {
      floating = false;
    }
  }

  if ( floating || lower % 1 || upper % 1 ) {
    return lower + rand() * ( upper - lower );
  }

  return math_round( lower + rand() * ( upper - lower ) );
};

var reduce = function ( iterable, iteratee, value ) {
  iterable = getIterable( toObject( iterable ) );
  iteratee = getIteratee( iteratee );

  var i = 0,
      length = getLength( iterable );

  if ( arguments.length < 3 ) {
    while ( i < length && !has( i, iterable ) ) {
      ++i;
    }

    if ( i === length ) {
      throw TypeError( ERR_REDUCE_OF_EMPTY_ARRAY );
    }

    value = iterable[ i++ ];
  }

  for ( ; i < length; ++i ) {
    if ( has( i, iterable ) ) {
      value = iteratee( value, iterable[ i ], i, iterable );
    }
  }

  return value;
};

var reduceRight = function ( iterable, iteratee, value ) {
  iterable = getIterable( toObject( iterable ) );
  iteratee = getIteratee( iteratee );

  var length = getLength( iterable ),
      i = length - 1;

  if ( arguments.length < 3 ) {
    while ( i >= 0 && !has( i, iterable ) ) {
      --i;
    }

    if ( i < 0 ) {
      throw TypeError( ERR_REDUCE_OF_EMPTY_ARRAY );
    }

    value = iterable[ i-- ];
  }

  for ( ; i >= 0; --i ) {
    if ( has( i, iterable ) ) {
      value = iteratee( value, iterable[ i ], i, iterable );
    }
  }

  return value;
};

var sample = function ( object ) {
  return baseSample( getIterable( toObject( object ) ) );
};

var sampleSize = function ( object, size ) {
  if ( object == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  object = toArray( object );

  if ( size === undefined ) {
    size = 1;
  } else {
    size = clamp( size, 0, getLength( object ) );
  }

  return baseShuffle( object, size );
};

/**
 * The `Object.setPrototypeOf()` polyfill.
 */
var setPrototypeOf = Object.setPrototypeOf || function ( target, prototype ) {
  if ( target == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  if ( prototype !== null && isPrimitive( prototype ) ) {
    throw TypeError( 'Object prototype may only be an Object or null: ' + prototype );
  }

  if ( !isPrimitive( target ) && has( '__proto__', target ) ) {
    // jshint proto: true
    target.__proto__ = prototype;
    // jshint proto: false
  }

  return target;
};

var shuffle = function ( object ) {
  if ( object == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  return baseShuffle( toArray( object ) );
};

var slice = function ( iterable, start, end ) {
  var len = getLength( iterable = toObject( iterable ) ),
      i, sliced, index;

  start = defaultIndex( start, len, 0 );
  end = defaultIndex( end, len, len );
  i = end - start;
  sliced = Array( i-- );

  for ( ; i >= 0; --i ) {
    index = start + i;

    if ( has( index, iterable ) ) {
      sliced[ i ] = iterable[ index ];
    }
  }

  return sliced;
};

var times = function ( times, callback ) {
  if ( typeof callback != 'function' ) {
    throw TypeError( ERR_FUNCTION_EXPECTED );
  }

  return baseTimes( times, callback );
};

var toArray = function ( value ) {
  if ( value == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  if ( isString( value ) ) {
    return value.split( '' );
  }

  if ( isArrayLikeObject( value ) ) {
    return baseCloneArray( value );
  }

  return baseValues( value, getKeys( value ) );
};

var toIndex = function ( value, length ) {
  return clamp( baseToIndex( value, length ), 0, length );
};

var toObject = function ( target ) {
  if ( target == null ) {
    throw TypeError( ERR_UNDEFINED_OR_NULL );
  }

  return Object( target );
};

var toPlainObject = function ( target ) {
  if ( target == null ) {
    return {};
  }

  return assignIn( {}, toObject( target ) );
};

var unique = function () {
  var unique = function ( value, i, iterable ) {
    return baseIndexOf( iterable, value ) == i;
  };

  return function ( iterable ) {
    return filter( iterable, unique );
  };
}();

var without = function ( iterable ) {
  var i = 0,
      length = ( iterable = toObject( iterable ) ).length,
      without = arr_slice.call( arguments, 1 ),
      temp = [],
      value;

  for ( ; i < length; ++i ) {
    value = iterable[ i ];

    if ( baseIndexOf( without, value ) < 0 ) {
      temp.push( value );
    }
  }

  return temp;
};

var defaults = function ( defaults, object ) {
  return mixin( true, clone( true, defaults ), object );
};

var assign = Object.assign || createAssign( getKeys ),
    assignIn = createAssign( getKeysIn ),
    each = createEach( false ),
    eachRight = createEach( true ),
    ceil = createRound( math_ceil ),
    every = createEverySome( true ),
    some = createEverySome( false ),
    filter = createFilter( false, getKeys ),
    filterIn = createFilter( false, getKeysIn ),
    reject = createFilter( true, getKeys ),
    rejectIn = createFilter( true, getKeysIn ),
    find = arr.find ? bindFast( fn_call, arr.find ) : createFind( false, false ),
    findIndex = arr.findIndex ? bindFast( fn_call, arr.findIndex ) : createFind( true, false ),
    findLast = createFind( false, true ),
    findLastIndex = createFind( true, true ),
    floor = createRound( math_floor ),
    forEach = createForEach( false ),
    forEachRight = createForEach( true ),
    forIn = createForIn( getKeysIn, false ),
    forInRight = createForIn( getKeysIn, true ),
    forOwn = createForIn( getKeys, false ),
    forOwnRight = createForIn( getKeys, true ),
    indexOf = createIndexOf( false ),
    lastIndexOf = createIndexOf( true ),
    map = createMap( false, getKeys ),
    mapIn = createMap( false, getKeysIn ),
    mapRight = createMap( true ),
    range = createRange( false ),
    rangeRight = createRange( true ),
    round = createRound( math_round ),
    upperFirst = createToCaseFirst( 'toUpperCase' ),
    lowerFirst = createToCaseFirst( 'toLowerCase' ),
    toPairs = Object.entries || createToPairs( getKeys ),
    toPairsIn = createToPairs( getKeysIn ),
    trim = str.trim ? bindFast( fn_call, str.trim ) : createTrim( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ ),
    trimStart = str.trimStart ? bindFast( fn_call, str.trimStart ) : createTrim( /^[\s\uFEFF\xA0]+/ ),
    trimEnd = str.trimEnd ? bindFast( fn_call, str.trimEnd ) : createTrim( /[\s\uFEFF\xA0]+$/ ),
    getValues = Object.values || createValues( getKeys ),
    getValuesIn = createValues( getKeysIn );

// from jquery
var event_props = [
  'altKey',        'bubbles',        'cancelable',
  'cancelBubble',  'changedTouches', 'ctrlKey',
  'currentTarget', 'detail',         'eventPhase',
  'metaKey',       'pageX',          'pageY',
  'shiftKey',      'view',           'char',
  'charCode',      'key',            'keyCode',
  'button',        'buttons',        'clientX',
  'clientY',       'offsetX',        'offsetY',
  'pointerId',     'pointerType',    'relatedTarget',
  'returnValue',   'screenX',        'screenY',
  'targetTouches', 'toElement',      'touches',
  'type',          'isTrusted'
];

// Based on jQuery.Event
var Event = function ( source, options ) {
  var i, key;

  if ( source && source.type !== undefined ) {
    for ( i = event_props.length - 1; i >= 0; --i ) {
      key = event_props[ i ];

      if ( has( key, source ) ) {
        this[ key ] = source[ key ];
      }
    }

    this.originalEvent = source;

    this.target = source.target && source.target.nodeType === 3 ?
      source.target.parentNode : source.target;

    this.which = event.which( source );
  } else {
    this.type = source;
  }

  if ( options !== undefined ) {
    assign( this, options );
  }

  this.timeStamp = timestamp();
};

Event.prototype = {
  preventDefault: function () {
    var event = this.originalEvent;

    if ( event ) {
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }

    this.returnValue = event.returnValue;
  },

  stopPropagation: function () {
    var event = this.originalEvent;

    if ( event ) {
      if ( event.stopPropagation ) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    }

    this.cancelBubble = event.cancelBubble;
  },

  constructor: Event
};

support.addEventListener = 'addEventListener' in window;

/**
 * Based on Jonathan Neal `addEventListener()` polyfill.
 * https://gist.github.com/jonathantneal/3748027
 */

var __event_list = create( null ),
    __event_list_types = [];

var event = {
  /**
   * Adds the event listener to the target,  with considering IE.
   */
  on: function ( target, type, listener, use_capture, one ) {
    var item;

    if ( use_capture === undefined ) {
      use_capture = false;
    }

    item = {
      use_capture: use_capture,
      listener: listener,
      target: target,
      one: one
    };

    if ( support.addEventListener ) {
      if ( one ) {
        item.wrapper = function ( ev ) {
          event.off( target, type, listener, use_capture );
          listener.call( target, ev );
        };
      } else {
        item.wrapper = listener;
      }

      target.addEventListener( type, item.wrapper, use_capture );
    } else if ( typeof listener == 'function' ) {
      item.wrapper = function ( ev ) {
        if ( type === 'DOMContentLoaded' && target.readyState !== 'complete' ) {
          return;
        }

        if ( one ) {
          event.off( target, type, listener, use_capture );
        }

        ev = new Event( ev || window.event );
        ev.type = type;
        listener.call( target, ev );
      };

      target.attachEvent(
        item.fixed_type = event.__fix_type( type ),
        item.wrapper );
    } else {
      throw TypeError( 'This functionality not implemented' );
    }

    if ( __event_list[ type ] ) {
      __event_list[ type ].push( item );
    } else {
      __event_list[ type ] = [ item ];
      __event_list[ type ].index = __event_list_types.length;
      __event_list_types.push( type );
    }
  },

  /**
   * Removes the event listener (or listeners) of the target, with considering IE.
   */

  // // remove click alert listener:
  // event.off( window, 'click', alert );
  // // remove all click listeners:
  // event.off( window, 'click' );
  // // remove all listeners:
  // event.off( window );

  off: function ( target, type, listener, use_capture ) {
    var i, remove_all, items, item;

    // remove all listeners.
    // event.off( target );
    if ( type === undefined ) {
      for ( i = __event_list_types.length - 1; i >= 0; --i ) {
        event.off( target, __event_list_types[ i ] );
      }

      return;
    }

    items = __event_list[ type ];

    if ( !items ) {
      return;
    }

    // event.off( target, type );
    remove_all = listener === undefined;

    if ( use_capture === undefined ) {
      use_capture = false;
    }

    for ( i = items.length - 1; i >= 0; --i ) {
      item = items[ i ];

      if ( item.target !== target ||
        !remove_all && (
          item.listener !== listener ||
          item.use_capture !== use_capture ) )
      {
        continue;
      }

      items.splice( i, 1 );

      if ( !items.length ) {
        __event_list_types.splice( items.index, 1 );
        __event_list[ type ] = null;
      }

      if ( support.addEventListener ) {
        target.removeEventListener( type, item.wrapper, item.use_capture );
      } else {
        target.detachEvent( item.fixed_type, item.wrapper );
      }
    }
  },

  // event.on( window, 'some-event', function ( event ) {
  //   alert( event.some_data );
  // } );
  //
  // event.trigger( window, 'some-event', {
  //   some_data: 'something'
  // } );
  //
  // // trigger all 'some-event' listeners.
  // event.trigger( null, 'some-event' );

  trigger: function ( target, type, data ) {
    var i = 0,
        items = __event_list[ type ],
        item, event;

    if ( !items ) {
      return;
    }

    for ( ; i < items.length; ++i ) {
      item = items[ i ];

      if ( item.target !== target && target ) {
        continue;
      }

      event = new Event( type, data );
      event.target = target || item.target;
      event.isTrusted = false;
      item.wrapper.call( target, event );
    }
  },

  copy: function ( target, source, deep ) {
    var i = __event_list_types.length - 1,
        type, items, item, j, len,
        t_children, s_children;

    for ( ; i >= 0; --i ) {
      items = __event_list[ type = __event_list_types[ i ] ];

      if ( !items ) {
        continue;
      }

      for ( j = 0, len = items.length; j < len; ++j ) {
        item = items[ j ];

        if ( item.target === source ) {
          event.on( target, type, item.listener, item.use_capture, item.one );
        }
      }
    }

    if ( deep ) {
      t_children = target.childNodes;
      s_children = source.childNodes;

      for ( i = t_children.length - 1; i >= 0; --i ) {
        event.copy( t_children[ i ], s_children[ i ], deep );
      }
    }

    return target;
  },

  // from jQuery
  which: function ( event ) {
    var button;

    if ( !event.type.indexOf( 'touch' ) ) {
      // It seems to me that this isn't correctly
      return 1;
    }

    // Add which for key events
    if ( event.which == null && !event.type.indexOf( 'key' ) ) {
      return event.charCode != null ? event.charCode : event.keyCode;
    }

    button = event.button;

    if ( event.which || button === undefined ||
      !/^(?:mouse|pointer|contextmenu|drag|drop)|click/.test( event.type ) )
    {
      return event.which;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right

    if ( button & 1 ) {
      return 1;
    }

    if ( button & 2 ) {
      return 3;
    }

    if ( button & 4 ) {
      return 2;
    }

    return 0;
  },

  __fix_type: function ( type ) {
    if ( type === 'DOMContentLoaded' ) {
      return 'onreadystatechange';
    }

    return 'on' + type;
  }
};

/**
 * Adapted from Jonathan Neal getComputedStyle polyfill.
 * https://github.com/jonathantneal/polyfill/blob/master/polyfills/getComputedStyle/polyfill.js
 */
var getComputedStyle = window.getComputedStyle || function () {
  var toDOMString = function () {
    var toDOMString = function ( letter ) {
      return '-' + letter.toLowerCase();
    };

    return function ( string ) {
      return string.replace( /[A-Z]/g, toDOMString );
    };
  };

  var getComputedStylePixel = function ( element, name, fontSize ) {
    // Internet Explorer sometimes struggles
    // to read currentStyle until the
    // element's document is accessed.
    var value = element.currentStyle[ name ]
          .match( /([\d.]+)(em|%|cm|in|mm|pc|pt|)/ ) || [ 0, 0, '' ],
        size = value[ 1 ],
        suffix = value[ 2 ],
        rootSize, parent;

    if ( fontSize === undefined ) {
      parent = element.parentElement;

      if ( !parent || suffix !== '%' && suffix !== 'em' ) {
        fontSize = 16;
      } else {
        fontSize = getComputedStylePixel( parent, 'fontSize' );
      }
    }

    if ( name == 'fontSize' ) {
      rootSize = fontSize;
    } else if ( /width/i.test( name ) ) {
      rootSize = element.clientWidth;
    } else {
      rootSize = element.clientHeight;
    }

    return suffix === 'em' ?
      size * fontSize : suffix === '%' ?
      size / 100 * rootSize : suffix === 'cm' ?
      size * 0.3937 * 96 : suffix === 'in' ?
      size * 96 : suffix === 'mm' ?
      size * 0.3937 * 96 / 10 : suffix === 'pc' ?
      size * 12 * 96 / 72 : suffix === 'pt' ?
      size * 96 / 72 : size;
  };

  var setShortStyleProperty = function ( style, name ) {
    var borderSuffix = name == 'border' ? 'Width' : '',
        t = name + 'Top' + borderSuffix,
        r = name + 'Right' + borderSuffix,
        b = name + 'Bottom' + borderSuffix,
        l = name + 'Left' + borderSuffix;

    if ( style[ t ] == style[ r ] && style[ t ] == style[ b ] && style[ t ] == style[ l ] ) {
      style[ name ] = style[ t ];
    } else if ( style[ t ] == style[ b ] && style[ l ] == style[ r ] ) {
      style[ name ] = style[ t ] + ' ' + style[ r ];
    } else if ( style[ l ] == style[ r ] ) {
      style[ name ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ];
    } else {
      style[ name ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ] + ' ' + style[ l ];
    }
  };

  var CSSStyleDeclaration = function ( element ) {
    var style = this,
        currentStyle = element.currentStyle,
        fontSize = getComputedStylePixel( element, 'fontSize' ),
        names = getKeys( currentStyle ),
        i = names.length,
        name;

    for ( ; i >= 0; --i ) {
      name = names[ i ];

      if ( name == null ) {
        continue;
      }

      arr_push.call( style, name == 'styleFloat' ? 'float' : toDOMString( name ) );

      if ( name == 'styleFloat' ) {
        style[ 'float' ] = currentStyle[ name ];
      } else if ( name == 'width' ) {
        style[ name ] = element.offsetWidth + 'px';
      } else if ( name == 'height' ) {
        style[ name ] = element.offsetHeight + 'px';
      } else if ( style[ name ] != 'auto' && /(margin|padding|border).*W/.test( name ) ) {
        style[ name ] = math_round( getComputedStylePixel( element, name, fontSize ) ) + 'px';
      } else if ( !name.indexOf( 'outline' ) ) {
        try {
          // errors on checking outline
          style[ name ] = currentStyle[ name ];
        } catch ( e ) {
          style.outline =
            ( style.outlineColor = currentStyle.color ) + ' ' +
            ( style.outlineStyle = style.outlineStyle || 'none' ) + ' ' +
            ( style.outlineWidth = style.outlineWidth || '0px' );
        }
      } else {
        style[ name ] = currentStyle[ name ];
      }
    }

    setShortStyleProperty( style, 'margin' );
    setShortStyleProperty( style, 'padding' );
    setShortStyleProperty( style, 'border' );
    style.fontSize = math_round( fontSize ) + 'px';
  };

  CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,

    getPropertyValue: function ( name ) {
      return this[ toCamelCase( name ) ];
    },

    item: function ( i ) {
      return this[ i ];
    },

    getPropertyPriority: noop,
    getPropertyCSSValue: noop,
    removeProperty: noop,
    setProperty: noop
  };

  return function getComputedStyle ( element ) {
    return new CSSStyleDeclaration( element );
  };
}();

/**
 * Based on Erik Möller requestAnimationFrame polyfill:
 *
 * Adapted from https://gist.github.com/paulirish/1579671 which derived from
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 *
 * requestAnimationFrame polyfill by Erik Möller.
 * Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon.
 *
 * MIT license
 */
var timer = function () {
  var timer = {},
      suffix = 'AnimationFrame',

  request = window[ 'request' + suffix ] ||
    window[ 'webkitRequest' + suffix ] ||
    window[ 'mozRequest' + suffix ],

  cancel = window[ 'cancel' + suffix ] ||
    window[ 'webkitCancel' + suffix ] ||
    window[ 'webkitCancelRequest' + suffix ] ||
    window[ 'mozCancel' + suffix ] ||
    window[ 'mozCancelRequest' + suffix ];

  // iOS6 is buggy
  if ( !request || !cancel ||
    /iP(ad|hone|od).*OS\s6/.test( window.navigator.userAgent ) )
  {
    var lastTime = 0,
        frameDuration = 1000 / 60;

    timer.request = function ( frame ) {
      var now = timestamp(),
          nextTime = max( lastTime + frameDuration, now );

      return window.setTimeout( function () {
        lastTime = nextTime;
        frame( now );
      }, nextTime - now );
    };

    timer.cancel = window.clearTimeout;
  } else {
    // Instead of `bind()`, manually create these functions.
    timer.request = function ( frame ) {
      return request( frame );
    };

    timer.cancel = function ( index ) {
      return cancel( index );
    };
  }

  return timer;
}();

var matches = window.Element && (
  Element.prototype.matches ||
  Element.prototype.oMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.webkitMatchesSelector ) ||

function ( selector ) {
  var element = this,
      elements, i;

  if ( typeof selector != 'string' ) {
    throw TypeError( ERR_STRING_EXPECTED );
  }

  if ( selector.charAt( 0 ) === '#' && !/\s/.test( selector ) ) {
    return '#' + element.id === selector;
  }

  elements = ( element.document || element.ownerDocument )
    .querySelectorAll( selector );

  for ( i = elements.length - 1; i >= 0; --i ) {
    if ( elements[ i ] === element ) {
      return true;
    }
  }

  return false;
};

var closest = window.Element &&
  Element.prototype.closest ||

function ( selector ) {
  var element = this;

  do {
    if ( matches.call( element, selector ) ) {
      return element;
    }
  } while ( ( element = element.parentElement ) );

  return null;
};

var parseHTML = function ( data, context ) {
  var match = regexps.single_tag.exec( data );

  if ( match ) {
    return [
      document.createElement( match[ 2 ] || match[ 3 ] )
    ];
  }

  return baseCloneArray( createFragment( [ data ], context || document ).childNodes );
};

support.getElementsByClassName = 'getElementsByClassName' in document;

var DOMWrapper = function ( selector ) {
  var match, list, i;

  // _();
  if ( !selector ) {
    return;
  }

  // _( window );
  if ( isDOMElement( selector ) ) {
    this.__set_one( selector );
    return this;
  }

  if ( typeof selector == 'string' ) {
    if ( selector.charAt( 0 ) != '<' ) {
      match = regexps.selector.exec( selector );

      // _( 'a > b + c' );
      if ( !match || !support.getElementsByClassName && match[ 3 ] ) {
        list = document.querySelectorAll( selector );

      // _( '#id' );
      } else if ( match[ 1 ] ) {
        list = document.getElementById( match[ 1 ] );

        if ( list ) {
          this.__set_one( list );
        }

        return;

      // _( 'tag' );
      } else if ( match[ 2 ] ) {
        list = document.getElementsByTagName( match[ 2 ] );

      // _( '.class' );
      } else {
        list = document.getElementsByClassName( match[ 3 ] );
      }

    // _( '<div>' );
    } else {
      list = parseHTML( selector );
    }

  // _( _( ... ) );
  } else if ( isArrayLikeObject( selector ) ) {
    list = selector;

  // _( function ( _ ) { ... } );
  } else if ( typeof selector == 'function' ) {
    return new DOMWrapper( document ).ready( selector );
  } else {
    throw TypeError( 'got unexpected selector: ' + selector );
  }

  if ( list ) {
    this.length = getLength( list );

    for ( i = this.length - 1; i >= 0; --i ) {
      this[ i ] = list[ i ];
    }
  }
};

/**
 * @class _
 * @alias peako
 * @param {DOMElement|String|ArrayLikeObject|Function} selector
 * @returns {DOMWrapper}
 */
var peako = function ( input ) {
  return new DOMWrapper( input );
};

var prototype = DOMWrapper.prototype = peako.prototype = peako.fn = {
  __set_one: function ( element ) {
    this[ 0 ] = element;
    this.length = 1;
  },

  get: function ( i ) {
    return i === undefined ?
      baseCloneArray( this ) : this[ i < 0 ? this.length + i : i ];
  },

  eq: function ( i ) {
    return this.pushStack( i === undefined ? this : [ this.get( i ) ] );
  },

  each: function ( iteratee ) {
    var i = 0,
        length = this.length;

    for ( ; i < length; ++i ) {
      if ( iteratee.call( this[ i ], i, this[ i ] ) === false ) {
        break;
      }
    }

    return this;
  },

  style: function ( name, value ) {
    var addUnit = 0;

    if ( isString( name ) ) {
      if ( !cssNumbers[ toCamelCase( name ) ] ) {
        if ( typeof value == 'function' ) {
          addUnit = 1;
        } else if ( isNumber( value ) ) {
          value += 'px';
        }
      }
    } else if ( isObject( name ) ) {
      addUnit = 2;
    }

    return access( this, function ( element, name, value, setStyle ) {
      if ( element.nodeType !== 1 ) {
        return null;
      }

      if ( !setStyle ) {
        return getStyle( element, name );
      }

      if ( ( addUnit === 2 ? !cssNumbers[ toCamelCase( name ) ] : addUnit === 1 ) &&
        isNumber( value ) )
      {
        value += 'px';
      }

      element.style[ name ] = value;
    }, name, value, arguments.length > 1, null );
  },

  addClass: function ( classes ) {
    var raw = typeof classes != 'function',
        i = this.length - 1,
        element;

    for ( ; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType === 1 ) {
        classList.add( element, raw ?
          classes :
          classes.call( element, i, element.className ) );
      }
    }

    return this;
  },

  removeClass: function ( classes ) {
    var all = classes === undefined,
        fn = !all && typeof classes === 'function',
        re = !fn && getType( classes ) === 'regexp',
        i = this.length - 1,
        element;

    for ( ; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType === 1 ) {
        switch ( true ) {
          case all:
            element.className = ''; break;
          case re:
            classList.removeWithRegexp( element, classes ); break;
          case fn:
            classList.remove( element,
              classes.call( element, i, element.className ) );
            break;
          default:
            classList.remove( element, classes );
        }
      }
    }

    return this;
  },

  toggleClass: function ( classes, state ) {
    if ( state !== undefined ) {
      return this[ state ? 'addClass' : 'removeClass' ]( classes );
    }

    var raw = typeof classes != 'function',
        i = this.length - 1,
        element;

    for ( ; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType === 1 ) {
        classList.toggle( element, raw ?
          classes :
          classes.call( element, i, element.className ) );
      }
    }

    return this;
  },

  hasClass: function ( classes ) {
    var i = this.length - 1,
        element;

    for ( ; i >= 0; --i ) {
      if ( ( element = this[ i ] ).nodeType === 1 &&
        classList.has( element, classes ) )
      {
        return true;
      }
    }

    return false;
  },

  offset: function ( options ) {
    var element, document, root, body,
        offset, byCallback, i, style, win;

    if ( !arguments.length ) {
      element = this[ 0 ];

      if ( !element || element.nodeType !== 1 ) {
        return null;
      }

      document = element.ownerDocument;
      root = document.documentElement;
      body = document.body;
      win = document.defaultView;
      offset = element.getBoundingClientRect();

      return {
        top: offset.top +
          ( win.pageYOffset || root.scrollTop || body.scrollTop ) -
          ( root.clientTop || body.clientTop || 0 ),
        left: offset.left +
          ( win.pageXOffset || root.scrollLeft || body.scrollLeft ) -
          ( root.clientLeft || body.clientLeft || 0 )
      };
    }

    if ( isPrimitive( options ) ) {
      throw TypeError( ERR_INVALID_ARGS );
    }

    byCallback = typeof options == 'function';

    for ( i = this.length - 1; i >= 0; --i ) {
      element = this[ i ];

      if ( element.nodeType !== 1 ) {
        continue;
      }

      offset = byCallback ?
        options.call( element, i, new DOMWrapper( element ).offset() ) :
        options;

      style = element.style;
      style.top = offset.top + 'px';
      style.left = offset.left +'px';

      if ( getStyle( element, 'position' ) === 'static' ) {
        style.position = 'relative';
      }
    }

    return this;
  },

  is: function ( selector ) {
    for ( var i = this.length - 1; i >= 0; --i ) {
      if ( is( this[ i ], selector, i ) ) {
        return true;
      }
    }

    return false;
  },

  closest: function ( selector ) {
    var i = 0,
        length = this.length,
        list = [],
        element, temp;

    for ( ; i < length; ++i ) {
      element = this[ i ];

      temp = element.nodeType === 1 &&
        closest.call( element, selector );

      if ( temp && baseIndexOf( list, temp ) < 0 ) {
        list.push( temp );
      }
    }

    return this.pushStack( list );
  },

  parent: function ( selector ) {
    var select = !!arguments.length,
        i = 0,
        length = this.length,
        list = [],
        element, parent;

    for ( ; i < length; ++i ) {
      element = this[ i ];

      parent = element.nodeType === 1 &&
        element.parentElement;

      if ( parent && baseIndexOf( list, parent ) < 0 &&
        ( !select || matches.call( parent, selector ) ) )
      {
        list.push( parent );
      }
    }

    return this.pushStack( list );
  },

  siblings: function ( selector ) {
    var select = !!arguments.length,
        i = 0,
        length = this.length,
        list = [],
        element, siblings, sibling, j, k;

    for ( ; i < length; ++i ) {
      element = this[ i ];

      siblings = element.nodeType === 1 &&
        element.parentElement.children;

      if ( !siblings ) {
        continue;
      }

      for ( j = 0, k = siblings.length; j < k; ++j ) {
        sibling = siblings[ j ];

        if ( sibling !== element &&
          sibling.nodeType === 1 &&
          baseIndexOf( list, sibling ) < 0 &&
          ( !select || matches.call( sibling, selector ) ) )
        {
          list.push( sibling );
        }
      }
    }

    return this.pushStack( list );
  },

  children: function ( selector ) {
    var len = this.length,
        els = this.pushStack(),
        el, children, child, c_len, i, j;

    for ( i = 0; i < len; ++i ) {
      // If the element isn't an HTML element or doesn't have children.
      if ( ( el = this[ i ] ).nodeType !== 1 || !( c_len = ( children = el.children ).length ) ) {
        continue;
      }

      for ( j = 0; j < c_len; ++j ) {
        child = children[ j ];

        if ( child.nodeType === 1 && ( !arguments.length || matches.call( child, selector ) ) ) {
          els[ els.length++ ] = child;
        }
      }
    }

    return els;
  },

  find: function ( selector ) {
    var i = 0,
        length = this.length,
        list = [],
        element, temp, j, k;

    for ( ; i < length; ++i ) {
      element = this[ i ];

      temp = element.nodeType === 1 &&
        element.querySelectorAll( selector );

      if ( !temp ) {
        continue;
      }

      for ( j = 0, k = temp.length; j < k; ++j ) {
        element = temp[ j ];

        if ( baseIndexOf( list, element ) < 0 ) {
          list.push( element );
        }
      }
    }

    return this.pushStack( list );
  },

  __filter: function ( selector, inverse ) {
    var len = this.length,
        els = this.pushStack(),
        el, i;

    for ( i = 0; i < len; ++i ) {
      el = this[ i ];

      // .not( 'span' ); // .__filter( 'span', true )
      // if the element is "span", then `is()`
      // returns true, then it will be false,
      // and the element will not be added.

      // disable the "Confusing use of '!'. (W018)" warning,
      // because "a != b" and "!a == b" behave differently.
      // we need to convert "a" to a boolean value.
      // jshint -W018
      if ( !is( el, selector, i ) == inverse ) {
      // jshint +W018
        els[ els.length++ ] = el;
      }
    }

    return els;
  },

  not: function ( selector ) {
    return this.__filter( selector, true );
  },

  offsetParent: function () {
    var i = 0,
        length = this.length,
        list = [],
        element, offsetParent;

    for ( ; i < length; ++i ) {
      element = this[ i ];

      if ( element.nodeType !== 1 ) {
        continue;
      }

      offsetParent = element.offsetParent;

      while ( offsetParent && getStyle( offsetParent, 'position' ) === 'static' ) {
        offsetParent = offsetParent.offsetParent;
      }

      if ( !offsetParent ) {
        offsetParent = element.ownerDocument.documentElement;
      }

      if ( baseIndexOf( list, offsetParent ) < 0 ) {
        list.push( offsetParent );
      }
    }

    return this.pushStack( list );
  },

  position: function () {
    var el = this[ 0 ],
        off, comp, parent_off, parent_comp, parent, $parent;

    if ( !el || el.nodeType !== 1 ) {
      return null;
    }

    comp = getComputedStyle( el );

    parent_off = {
      left: 0,
      top: 0
    };

    if ( comp.position !== 'fixed' ) {
      parent = ( $parent = this.offsetParent() )[ 0 ];

      if ( !parent || parent.nodeType !== 1 ) {
        return null;
      }

      off = this.offset();

      if ( parent.nodeName !== 'HTML' ) {
        parent_off = $parent.offset();
      }

      parent_comp = getComputedStyle( parent );
      parent_off.left += window.parseInt( parent_comp.borderLeftWidth, 10 );
      parent_off.top += window.parseInt( parent_comp.borderTopWidth, 10 );
    } else {
      off = el.getBoundingClientRect();
    }

    return {
      left: off.left - parent_off.left - window.parseInt( comp.marginLeft, 10 ),
      top: off.top - parent_off.top - window.parseInt( comp.marginTop, 10 )
    };
  },

  remove: function () {
    return this.each( function () {
      var nodeType = this.nodeType,
          parentNode;

      if ( (
        nodeType === 1 ||
        nodeType === 3 ||
        nodeType === 8 ||
        nodeType === 9 ||
        nodeType === 11
      ) && ( parentNode = this.parentNode ) )
      {
        parentNode.removeChild( this );
      }
    } );
  },

  ready: function ( callback ) {
    var document = this[ 0 ],
        readyState;

    if ( !document || document.nodeType !== 9 ) {
      return this;
    }

    readyState = document.readyState;

    if ( document.attachEvent ?
      readyState === 'complete' :
      readyState !== 'loading' )
    {
      callback( peako );
    } else {
      event.on( document, 'DOMContentLoaded', function () {
        callback( peako );
      }, false, true );
    }

    return this;
  },

  pushStack: function ( elements ) {
    var wrapper = new DOMWrapper();

    if ( elements ) {
      baseCopyArray( wrapper, elements );
      wrapper.length = elements.length;
    }

    wrapper.prevObject = this;
    return wrapper;
  },

  end: function () {
    return this.prevObject || new DOMWrapper();
  },

  filter: function ( selector ) {
    return this.__filter( selector, false );
  },

  first: function () {
    return this.eq( 0 );
  },

  last: function () {
    return this.eq( -1 );
  },

  map: function ( callback ) {
    var i = 0,
        length = this.length,
        temp = new DOMWrapper(),
        element;

    temp.length = this.length;

    for ( ; i < length; ++i ) {
      temp[ i ] = callback.call( element = this[ i ], i, element );
    }

    return temp;
  },

  clone: function ( deep ) {
    if ( !arguments.length ) {
      deep = true;
    }

    return this.map( function ( element ) {
      return element.nodeType === 1 ?
        cloneNode( element, deep ) : element;
    } );
  },

  append: function () {
    return manipulation( this, function ( element, content ) {
      element.appendChild( content );
    }, arguments );
  },

  prepend: function () {
    return manipulation( this, function ( element, content ) {
      var firstChild = element.firstChild;

      if ( firstChild ) {
        element.insertBefore( content, firstChild );
      } else {
        element.appendChild( content );
      }
    }, arguments );
  },

  after: function () {
    return manipulation( this, function ( element, content ) {
      var parentNode = element.parentNode,
          nextSibling;

      if ( parentNode ) {
        if ( ( nextSibling = element.nextSibling ) ) {
          parentNode.insertBefore( content, nextSibling );
        } else {
          parentNode.appendChild( content );
        }
      }
    }, arguments );
  },

  before: function () {
    return manipulation( this, function ( element, content ) {
      var parentNode = element.parentNode;

      if ( parentNode ) {
        parentNode.insertBefore( content, element );
      }
    }, arguments );
  },

  slice: function ( start, end ) {
    return this.pushStack( slice( this, start, end ) );
  },

  toggle: function ( state ) {
    return this.each( function () {
      if ( this.nodeType === 1 ) {
        if ( state === undefined ?
          getStyle( this, 'display' ) === 'none' : state )
        {
          show.call( this );
        } else {
          hide.call( this );
        }
      }
    } );
  },

  longtouch: function ( longtouch, touch, delay ) {
    var ontouch = typeof touch == 'function',
        touched = true,
        target, id;

    if ( delay === undefined ) {
      delay = ontouch || touch === undefined ?
        300 : touch;
    }

    return this
      .touchstart( function ( event ) {
        target = this;

        id = window.setTimeout( function () {
          touched = false;
          longtouch.call( target, event );
        }, delay );
      } )
      .touchend( function ( event ) {
        window.clearTimeout( id );

        if ( ontouch && touched ) {
          touch.call( this, event );
        }

        touched = true;
      } );
  },

  constructor: peako,
  length: 0
};

forOwnRight( {
  next: 'nextSibling',
  prev: 'previousSibling'
}, function ( nextSibling, name ) {
  this[ name ] = function ( selector ) {
    var els = this.pushStack(),
        len = this.length,
        sibling, el, i;

    for ( i = 0; i < len; ++i ) {
      el = this[ i ];

      if ( el.nodeType !== 1 ) {
        continue;
      }

      // Skip some weird stuff (spaces, comments, whatever...)
      while ( ( sibling = el[ nextSibling ] ) && sibling.nodeType !== 1 );

      if ( sibling && ( !selector || is( sibling, selector, i ) ) ) {
        els[ els.length++ ] = sibling;
      }
    }

    return els;
  };
}, prototype );

forOwnRight( {
  value: 'value',
  text: 'textContent' in body ? 'textContent' : 'innerText',
  html: 'innerHTML'
}, function ( name, methodName ) {
  this[ methodName ] = function ( value ) {
    return access( this, function ( element, name, value, chainable ) {
      if ( element.nodeType !== 1 ) {
        return null;
      }

      if ( !chainable ) {
        return element[ name ];
      }

      element[ name ] = value;
    }, name, value, !!arguments.length, null );
  };
}, prototype );

forOwnRight( {
  on     : 'on',
  one    : 'on',
  off    : 'off',
  trigger: 'trigger'
}, function ( name, methodName ) {
  var one = methodName === 'one',
      off = methodName === 'off';

  this[ methodName ] = function ( types, listener, useCapture ) {
    var removeAll = off && !arguments.length,
        i = this.length - 1,
        element, j, k;

    if ( !removeAll ) {
      types = types.match( regexps.not_spaces );

      if ( !types ) {
        return this;
      }

      k = types.length;
    }

    for ( ; i >= 0; --i ) {
      element = this[ i ];

      if ( !removeAll ) {
        for ( j = 0; j < k; ++j ) {
          event[ name ]( element, types[ j ], listener, useCapture, one );
        }
      } else {
        event[ name ]( element );
      }
    }

    return this;
  };
}, prototype );

forOwnRight( {
  width: 'Width',
  height: 'Height'
}, function ( name, methodName ) {
  this[ methodName ] = function ( value ) {
    var element, body, root;

    if ( arguments.length ) {
      return this.style( methodName, value );
    }

    element = this[ 0 ];

    if ( !element ) {
      value = null;
    } else if ( element.window === element ) {
      value = max(
        element.document.documentElement[ 'client' + name ],
        element[ 'inner' + name ] || 0 );
    } else if ( element.nodeType === 9 ) {
      body = element.body;
      root = element.documentElement;

      value = max(
        body[ 'scroll' + name ],
        root[ 'scroll' + name ],
        body[ 'offset' + name ],
        root[ 'offset' + name ],
        body[ 'client' + name ],
        root[ 'client' + name ] );
    } else {
      value = element[ 'client' + name ];
    }

    return value;
  };
}, prototype );

var getWindow = function ( element ) {
  return element.window === element ?
    element : element.nodeType === 9 ?
    document.defaultView || document.parentWindow : false;
};

forOwnRight( {
  scrollTop: 'pageYOffset',
  scrollLeft: 'pageXOffset'
}, function ( offset, name ) {
  var top = name === 'scrollTop';

  this[ name ] = function ( value ) {
    var i, element, window, x, y;

    if ( arguments.length ) {
      for ( i = this.length - 1; i >= 0; --i ) {
        element = this[ i ];
        window = getWindow( element );

        if ( window ) {
          if ( top ) {
            x = window.pageXOffset || window.document.body.scrollLeft || 0;
            y = value;
          } else {
            x = value;
            y = window.pageYOffset || window.document.body.scrollTop || 0;
          }

          window.scrollTo( x, y );
        } else {
          element[ name ] = value;
        }
      }

      return this;
    }

    return ( element = this[ 0 ] ) ?
      ( window = getWindow( element ) ) ?
        window[ offset ] || window.document.body[ name ] || 0 : element[ name ] : null;
  };
}, prototype );

var hide = function () {
  if ( this.nodeType === 1 ) {
    this.style.display = 'none';
  }
};

var show = function () {
  var style;

  if ( this.nodeType !== 1 ) {
    return;
  }

  style = this.style;

  if ( style.display === 'none' ) {
    style.display = '';
  }

  if ( getComputedStyle( this ).display === 'none' ) {
    style.display = getDefaultVisibleDisplay( this );
  }
};

forOwnRight( { hide: hide, show: show }, function ( method, name ) {
  this[ name ] = function () {
    return this.each( method );
  };
}, prototype );

var toggle = function ( element, name, state, setState ) {
  if ( element.nodeType !== 1 ) {
    return null;
  }

  if ( !setState ) {
    return element[ name ];
  }

  element[ name ] = state;
};

baseForEach( [ 'checked', 'disabled' ], function ( methodName ) {
  this[ methodName ] = function ( state ) {
    return access( this, toggle, methodName, state, arguments.length > 0, null );
  };
}, prototype, true );

var cloneNode = function ( element, deep ) {
  return event.copy( element.cloneNode( deep ), element, deep );
};

var wrapMap = {
  col     : [ 2, '<table><colgroup>', '</colgroup></table>' ],
  tr      : [ 2, '<table><tbody>', '</tbody></table>' ],
  defaults: [ 0, '', '' ]
};

wrapMap.optgroup =
  wrapMap.option = [ 1, '<select multiple="multiple">', '</select>' ];

wrapMap.tbody =
  wrapMap.tfoot =
  wrapMap.colgroup =
  wrapMap.caption =
  wrapMap.thead = [ 1, '<table>', '</table>' ];

wrapMap.th = wrapMap.td = [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ];

var RE_HTML = /<|&#?\w+;/,
    RE_TAG_NAME = /<([a-z][^\s>]*)/i;

var createFragment = function ( elements, context ) {
  var i = 0,
      length = elements.length,
      fragment = context.createDocumentFragment(),
      nodes = [],
      element, temp, tag, wrap, j;

  for ( ; i < length; ++i ) {
    if ( isObjectLike( element = elements[ i ] ) ) {
      baseMerge( nodes, 'nodeType' in element ? [ element ] : element );
    } else if ( RE_HTML.test( element ) ) {
      if ( !temp ) {
        temp = context.createElement( 'div' );
      }

      wrap = wrapMap[ ( tag = RE_TAG_NAME.exec( element ) ) ?
        tag[ 1 ].toLowerCase() : '' ] || wrapMap.defaults;

      temp.innerHTML = wrap[ 1 ] + element + wrap[ 2 ];

      for ( j = wrap[ 0 ]; j > 0; --j ) {
        temp = temp.lastChild;
      }

      baseMerge( nodes, temp.childNodes );
      temp.innerHTML = '';
    } else {
      nodes.push( context.createTextNode( element ) );
    }
  }

  for ( i = 0, length = nodes.length; i < length; ++i ) {
    fragment.appendChild( nodes[ i ] );
  }

  return fragment;
};

var manipulation = function ( collection, callback, args ) {
  args = apply( arr_concat, [], args );

  var i = 0,
      length = collection.length,
      last = length - 1,
      fragment, element, context;

  if ( length ) {
    if ( typeof args[ 0 ] == 'function' ) {
      for ( ; i < length; ++i ) {
        element = collection[ i ];

        manipulation( new DOMWrapper( element ), callback, [
          args[ 0 ].call( element, i, element )
        ] );
      }
    } else if ( ( context = collection[ 0 ].ownerDocument ) ) {
      fragment = createFragment( args, context );

      for ( ; i < length; ++i ) {
        element = collection[ i ];
        callback( element, i == last ? fragment : cloneNode( fragment, true ) );
      }
    }
  }

  return collection;
};

// jQuery 3.2.1
var access = function ( collection, callback, key, value, chainable, empty, raw ) {
  var bulk = key == null,
      i = 0,
      length = collection.length,
      element, keys, j, k_len;

  if ( !bulk && getType( key ) == 'object' ) {
    chainable = true;
    k_len = ( keys = getKeys( key ) ).length;
    
    for ( j = 0; j < k_len; ++j ) {
      access( collection, callback, keys[ j ], key[ keys[ j ] ], chainable, empty, raw );
    }
  } else if ( value !== undefined ) {
    chainable = true;

    if ( typeof value != 'function' ) {
      raw = true;
    }

    if ( bulk ) {
      if ( raw ) {
        callback.call( collection, value );
        callback = null;
      } else {
        bulk = callback;

        callback = function ( element, key, value ) {
          return bulk.call( new DOMWrapper( element ), value );
        };
      }
    }

    if ( callback ) {
      for ( ; i < length; ++i ) {
        callback(
          ( element = collection[ i ] ),
          key, raw ?
            value :
            value.call( element, i, callback( element, key ) ),
          chainable );
      }
    }
  }

  return chainable ?
    collection : bulk ?
    callback.call( collection ) : length ?
    callback( collection[ 0 ], key, undefined, chainable ) : empty;
};

// jQuery 3.2.1
var cssNumbers = {
  "animationIterationCount": true,
  "columnCount": true,
  "fillOpacity": true,
  "flexGrow": true,
  "flexShrink": true,
  "fontWeight": true,
  "lineHeight": true,
  "opacity": true,
  "order": true,
  "orphans": true,
  "widows": true,
  "zIndex": true,
  "zoom": true
};

var is = function ( element, selector, index ) {
  if ( typeof selector == 'string' ) {
    return element.nodeType === 1 && matches.call( element, selector );
  }

  if ( isArrayLikeObject( selector ) ) {
    return indexOf( selector, element ) >= 0;
  }

  if ( typeof selector == 'function' ) {
    return selector.call( element, index, element );
  }

  return element === selector;
};

var defaultVisibleDisplayMap = {};

var getDefaultVisibleDisplay = function ( target ) {
  var nodeName = target.nodeName,
      display = defaultVisibleDisplayMap[ nodeName ],
      doc, el;

  if ( !display ) {
    // Get the document in which now is `target`.
    doc = target.ownerDocument;
    // Create the same element as the `target`. Add it to the `document`.
    el = doc.body.appendChild( doc.createElement( nodeName ) );
    // Get it 'display' style.
    display = getComputedStyle( el ).display;
    // This element is no longer needed. */
    doc.body.removeChild( el );
    // IE can don't to delete element from the memory? */
    el = doc = null;

    // Force the `target` to show.
    if ( display === 'none' ) {
      display = 'block';
    }

    // Caching results.
    defaultVisibleDisplayMap[ nodeName ] = display;
  }

  return display;
};

support.getAttribute = function () {
  var span = document.createElement( 'span' ),
      name = 'name';

  try {
    span.setAttribute( name, name );
    return span.getAttribute( name ) === name;
  } catch ( e ) {}

  return false;
}();

var propNames = {
  'for': 'htmlFor',
  'class': 'className'
};

var attr = function ( element, name, value, setValue ) {
  if ( element.nodeType !== 1 ) {
    return null;
  }

  if ( propNames[ name ] || !support.getAttribute ) {
    return prop( element, propNames[ name ] || name, value, setValue );
  }

  if ( !setValue ) {
    return element.getAttribute( name );
  }

  element.setAttribute( name, value );
};

var prop = function ( element, name, value, setValue ) {
  if ( !setValue ) {
    return element[ name ];
  }

  element[ name ] = value;
};

var removeAttr = function ( element, names ) {
  if ( element.nodeType !== 1 ) {
    return;
  }

  names = toWords( names );

  for ( var i = names.length - 1; i >= 0; --i ) {
    if ( support.getAttribute ) {
      element.removeAttribute( names[ i ] );
    } else {
      delete element[ propNames[ names[ i ] ] || names[ i ] ];
    }
  }
};

var removeProp = function ( element, names ) {
  var i = ( names = toWords( names ) ).length - 1;

  for ( ; i >= 0; --i ) {
    delete element[ names[ i ] ];
  }
};

forOwnRight( { attr: attr, prop: prop }, function ( method, methodName ) {
  this[ methodName ] = function ( name, value ) {
    return access( this, method, name, value, arguments.length > 1, null );
  };
}, prototype );

forOwnRight( {
  removeAttr: removeAttr,
  removeProp: removeProp
}, function ( method, methodName ) {
  this[ methodName ] = function ( names ) {
    return this.each( function () {
      method( this, names );
    } );
  };
}, prototype );

var classList = {
  add: function ( element, classes ) {
    classes = toWords( classes );

    if ( !classes.length ) {
      return;
    }

    var i = 0,
        length = classes.length,
        className = ' ' + classList.getAsArray( element ).join( ' ' ) + ' ',
        value;

    for ( ; i < length; ++i ) {
      value = classes[ i ] + ' ';

      if ( className.indexOf( ' ' + value ) < 0 ) {
        className += value;
      }
    }

    element.className = trim( className );
  },

  remove: function ( element, classes ) {
    classes = toWords( classes );

    if ( !classes.length ) {
      return;
    }

    var i = classes.length - 1,
        className = ' ' + classList.getAsArray( element ).join( ' ' ) + ' ',
        value;

    for ( ; i >= 0; --i ) {
      value = ' ' + classes[ i ] + ' ';

      while ( className.indexOf( value ) >= 0 ) {
        className = className.replace( value, ' ' );
      }
    }

    element.className = trim( className );
  },

  removeWithRegexp: function () {
    var test = function ( value ) {
      return classList.test( value );
    };

    return function ( element, regexp ) {
      element.className = reject( classList.getAsArray( element ), test, regexp ).join( ' ' );
    };
  }(),

  toggle: function ( element, classes ) {
    classes = toWords( classes );

    if ( !classes.length ) {
      return;
    }

    var i = 0,
        length = classes.length,
        className = ' ' + classList.getAsArray( element ).join( ' ' ) + ' ',
        value;

    for ( ; i < length; ++i ) {
      value = classes[ i ];

      if ( className.indexOf( ' ' + value + ' ' ) < 0 ) {
        classList.add( element, value );
      } else {
        classList.remove( element, value );
      }
    }
  },

  has: function ( element, classes ) {
    var className, i;

    classes = toWords( classes );

    if ( !classes.length ) {
      return false;
    }

    className = ' ' + classList
      .getAsArray( element )
      .join( ' ' ) + ' ';

    for ( i = classes.length - 1; i >= 0; --i ) {
      if ( className.indexOf( ' ' + classes[ i ] + ' ' ) < 0 ) {
        return false;
      }
    }

    return true;
  },

  getAsArray: function ( element ) {
    return toWords( element.className );
  },

  getAsString: function ( element ) {
    return element.className.replace( regexps.not_spaces, ' ' );
  }
};

/*
 * Based on Taylor Hakes Promise polyfill.
 * https://github.com/taylorhakes/promise-polyfill
 */
var Promise = window.Promise || function () {
  var Promise = function ( executor ) {
    if ( !isObjectLike( this ) || !( this instanceof Promise ) ) {
      throw TypeError( this + ' is not a promise' );
    }

    if ( typeof executor != 'function' ) {
      throw TypeError( 'Promise resolver ' + executor + ' is not a function' );
    }

    execute( executor, addWrapper( this ) );
  };

  Promise.prototype = {
    constructor: Promise,

    then: function ( fulfilled, rejected ) {
      var promise = new Promise( noop ),
          wrapper = getWrapper( promise ),
          deferred = new Deferred( fulfilled, rejected, wrapper );

      handle( getWrapper( this ), deferred );
      return promise;
    },

    'catch': function ( reject ) {
      return this.then( null, reject );
    }
  };

  assign( Promise, {
    all: function ( iterable ) {
      var args = arr_slice.call( iterable ),
          remaining = args.length;

      return new Promise( function ( resolve, reject ) {
        if ( !remaining ) {
          return resolve( args );
        }

        var res = function ( value, args ) {
          try {
            if ( !isPrimitive( value ) && typeof value.then == 'function' ) {
              value.then( function ( value ) {
                res( value, args );
              }, reject );
            } else if ( !--remaining ) {
              resolve( args );
            }
          } catch ( error ) {
            reject( error );
          }
        };

        var i = 0,
            length = remaining;

        for ( ; i < length; ++i ) {
          res( args[ i ], args );
        }
      } );
    },

    resolve: function ( value ) {
      return new Promise( function ( resolve ) {
        resolve( value );
      } );
    },

    reject: function ( value ) {
      return new Promise( function ( resolve, reject ) {
        reject( value );
      } );
    },

    race: function ( values ) {
      return new Promise( function ( resolve, reject ) {
        var i = 0,
            length = values.length;

        for ( ; i < length; ++i ) {
          values[ i ].then( resolve, reject );
        }
      } );
    }
  } );

  var Wrapper = function ( promise ) {
    this.promise = promise;
    this.deferreds = [];
  };

  Wrapper.prototype = {
    constructor: Wrapper,
    handled: false,
    state: 0
  };

  var Deferred = function ( onFulfilled, onRejected, promise ) {
    if ( typeof onFulfilled == 'function' ) {
      this.onFulfilled = onFulfilled;
    }

    if ( typeof onRejected == 'function' ) {
      this.onRejected = onRejected;
    }

    this.promise = promise;
  };

  Deferred.prototype = {
    constructor: Deferred,
    onFulfilled: null,
    onRejected: null
  };

  // Memory leak! Need to rewrite this polyfill.
  var promises = [],
      wrappers = [];

  var addWrapper = function ( promise ) {
    var wrapper = promise;

    if ( !( promise instanceof Wrapper ) && !getWrapper( promise ) ) {
      promises.push( promise );
      wrappers.push( wrapper = new Wrapper( wrapper ) );
    }

    return wrapper;
  };

  var getWrapper = function ( promise ) {
    return ( promise = baseIndexOf( promises, promise ) ) < 0 ?
      null : wrappers[ promise ];
  };

  var execute = function ( executor, wrapper ) {
    var done = false;

    try {
      executor( function ( value ) {
        if ( !done ) {
          done = true;
          resolve( wrapper, value );
        }
      }, function ( reason ) {
        if ( !done ) {
          done = true;
          reject( wrapper, reason );
        }
      } );
    } catch ( error ) {
      if ( !done ) {
        reject( wrapper, error );
      }
    }
  };

  var resolve = function ( wrapper, value ) {
    try {
      if ( value === wrapper.promise ) {
        throw TypeError( "A promise can't be resolved with itself" );
      }

      if ( isPrimitive( value ) || typeof value.then != 'function' ) {
        wrapper.state = 1;
        wrapper.value = value;
        finale( wrapper );
      } else if ( value instanceof Promise ) {
        wrapper.state = 3;
        wrapper.value = getWrapper( value );
        finale( wrapper );
      } else {
        execute( function ( resolve, reject ) {
          value.then( resolve, reject );
        }, wrapper );
      }
    } catch ( error ) {
      reject( wrapper, error );
    }
  };

  var reject = function ( wrapper, value ) {
    wrapper.state = 2;
    wrapper.value = value;
    finale( wrapper );
  };

  var finale = function ( wrapper ) {
    var i = 0,
        length = wrapper.deferreds.length;

    if ( wrapper.state === 2 && !length ) {
      setImmediate( function () {
        if ( !wrapper.handled ) {
          warn( 'Possible Unhandled Promise Rejection: ', wrapper.value );
        }
      } );
    }

    for ( ; i < length; ++i ) {
      handle( wrapper, wrapper.deferreds[ i ] );
    }

    delete wrapper.deferreds;
  };

  var handle = function ( wrapper, deferred ) {
    while ( wrapper.state === 3 ) {
      wrapper = wrapper.value;
    }

    if ( wrapper.state === 0 ) {
      return wrapper.deferreds.push( deferred );
    }

    wrapper.handled = true;

    setImmediate( function () {
      var containsValue = wrapper.state === 1,
          temp, callback;

      if ( containsValue ) {
        callback = deferred.onFulfilled;
      } else {
        callback = deferred.onRejected;
      }

      if ( !callback ) {
        if ( containsValue ) {
          callback = resolve;
        } else {
          callback = reject;
        }

        callback( deferred.promise, wrapper.value );
        return;
      }

      try {
        temp = callback( wrapper.value );
      } catch ( error ) {
        return reject( deferred.promise, error );
      }

      resolve( deferred.promise, temp );
    } );
  };

  var setImmediate = window.setImmediate || function ( callback ) {
    window.setTimeout( callback, 0 );
  };

  return Promise;
}();

baseForEach( [
  'blur',        'focus',       'focusin',
  'focusout',    'resize',      'scroll',
  'click',       'dblclick',    'mousedown',
  'mouseup',     'mousemove',   'mouseover',
  'mouseout',    'mouseenter',  'mouseleave',
  'change',      'select',      'submit',
  'keydown',     'keypress',    'keyup',
  'contextmenu', 'touchstart',  'touchmove',
  'touchend',    'touchenter',  'touchleave',
  'touchcancel', 'load'
], function ( type ) {
  this[ type ] = function ( argument ) {
    var len, i;

    if ( typeof argument != 'function' ) {
      return this.trigger( type, argument );
    }

    for ( len = arguments.length, i = 0; i < len; ++i ) {
      this.on( type, arguments[ i ], false );
    }

    return this;
  };
}, prototype, true );

baseForIn( {
  appendTo    : 'append',
  prependTo   : 'prepend',
  insertBefore: 'before',
  insertAfter : 'after'
}, function ( based, name ) {
  this[ name ] = function ( element ) {
    if ( element instanceof DOMWrapper == false ) {
      new DOMWrapper( element )[ based ]( this );
    } else {
      element[ based ]( this );
    }

    return this;
  };
}, prototype, [ 'appendTo', 'prependTo', 'insertBefore', 'insertAfter' ], true );

var warn = console && console.warn || noop;

// for _.typy method
var types = create( null );

var fetch, Headers, Request, Response;

support.fetch = has( 'fetch', window ) &&
  has( 'Headers', window ) &&
  has( 'Request', window ) &&
  has( 'Response', window );

if ( !support.fetch ) {
  /*
   * based on Cam Song `fetch()` polyfill from
   * https://github.com/camsong/fetch-ie8
   */

  var normalize_name = function ( name ) {
    if ( /[^\w-#$%&'*+.^`|~]/.test( name += '' ) ) {
      throw TypeError( 'Invalid character in header field name' );
    }

    return name.toLowerCase();
  };

  var normalize_value = function ( value ) {
    return '' + value;
  };

  var append = function ( value, name ) {
    this.append( name, value );
  };

  Headers = function ( headers ) {
    this.map = {};

    if ( headers ) {
      if ( headers instanceof Headers ) {
        headers.forEach( append, this );
      } else {
        forOwn( headers, append, this );
      }
    }
  };

  Headers.prototype.append = function ( name, value ) {
    var list = this.map[ name = normalize_name( name ) ];

    if ( list ) {
      list.push( normalize_value( value ) );
    } else {
      this.map[ name ] = [ normalize_value( value ) ];
    }
  };

  Headers.prototype[ 'delete' ] = function ( name ) {
    delete this.map[ normalize_name( name ) ];
  };

  Headers.prototype.get = function ( name ) {
    var values = this.map[ normalize_value( name ) ];

    if ( values ) {
      return values[ 0 ];
    }

    return null;
  };

  Headers.prototype.getAll = function ( name ) {
    return this.map[ normalize_value( name ) ] || [];
  };

  Headers.prototype.has = function ( name ) {
    return hasOwnProperty.call( this.map, normalize_name( name ) );
  };

  Headers.prototype.set = function( name, value ) {
    this.map[ normalize_name( name ) ] = [ normalize_value( value ) ];
  };

  Headers.prototype.forEach = function ( iteratee, context ) {
    forOwn( this.map, function ( values, name ) {
      forEach( values, function ( value ) {
        iteratee.call( context, value, name, this );
      }, this );
    }, this );
  };

  var consumed = function ( body ) {
    if ( body.bodyUsed ) {
      return Promise.reject( TypeError( 'Already read' ) );
    }

    body.bodyUsed = true;
  };

  var file_reader_ready = function ( reader ) {
    return new Promise( function ( resolve, reject ) {
      reader.onload = function () {
        resolve( reader.result );
      };

      reader.onerror = function () {
        reject( reader.error );
      };
    } );
  };

  var read_blob_as_array_buffer = function ( blob ) {
    var reader = new FileReader();
    reader.readAsArrayBuffer( blob );
    return file_reader_ready( reader );
  };

  var read_blob_as_text = function ( blob, options ) {
    var content_type = options.headers.map[ 'content-type' ] || '',
        reader, regexp, charset;

    if ( content_type ) {
      content_type += '';
    }

    charset = ( regexp = /charset=([-\w]*);?/ ).exec( blob.type ) ||
      regexp.exec( content_type );

    reader = new FileReader();

    if ( charset ) {
      reader.readAsText( blob, charset[ 1 ] );
    } else {
      reader.readAsText( blob );
    }

    return file_reader_ready( reader );
  };

  support.blob = has( 'FileReader', window ) && has( 'Blob', window ) && function () {
    try {
      return new Blob(), true;
    } catch ( e ) {}

    return false;
  }();

  support.formData = has( 'FormData', window );
  support.arrayBuffer = has( 'ArrayBuffer', window );

  var init_body = function ( that, body, options ) {
    that._initial_body = body;

    if ( typeof body == 'string' ) {
      that._text = body;
    } else if ( support.blob && isPrototypeOf.call( Blob.prototype, body ) ) {
      that._blob = body;
      that._options = options;
    } else if ( support.formData && isPrototypeOf.call( FormData.prototype, body ) ) {
      that._form_data = body;
    } else if ( !body ) {
      that._text = '';
    } else if ( !support.arrayBuffer || !isPrototypeOf.call( ArrayBuffer.prototype, body ) ) {
      // Only support ArrayBuffers for POST method.
      // Receiving ArrayBuffers happens via Blobs, instead.
      throw Error( 'unsupported BodyInit type' );
    }
  };

  var normalize_method = function ( method ) {
    var upcased = ( method += '' ).toUpperCase();

    if ( upcased === 'DELETE' ||
      upcased === 'GET' ||
      upcased === 'HEAD' ||
      upcased === 'OPTIONS' ||
      upcased === 'POST' ||
      upcased === 'PUT' )
    {
      return upcased;
    }

    return method;
  };

  Request = function ( input, options ) {
    if ( options === undefined ) {
      options = {};
    }

    var body = options.body;

    if ( isPrototypeOf.call( Request.prototype, input ) ) {
      if ( input.bodyUsed ) {
        throw TypeError( 'Already read' );
      }

      if ( !body ) {
        body = input._initial_body;
        input.bodyUsed = true;
      }

      if ( !options.headers ) {
        this.headers = new Headers( input.headers );
      }

      this.credentials = input.credentials;
      this.method = input.method;
      this.mode = input.mode;
      this.url = input.url;
    } else {
      this.url = input;
    }

    if ( options.credentials !== undefined ) {
      this.credentials = options.credentials;
    }

    if ( options.method !== undefined ) {
      this.method = normalize_method( options.method );
    }

    if ( options.headers || !this.headers ) {
      this.headers = new Headers( options.headers );
    }

    if ( options.mode !== undefined ) {
      this.mode = options.mode;
    }

    if ( body && ( this.method === 'GET' || this.method === 'HEAD' ) ) {
      throw TypeError( 'Body not allowed for GET or HEAD requests' );
    }

    init_body( this, body, options );
  };

  Request.prototype.clone = function () {
    return new Request( this );
  };

  Request.prototype.credentials = 'omit';
  Request.prototype.referrer = null;
  Request.prototype.method = 'GET';
  Request.prototype.mode = null;

  var headers = function ( xhr ) {
    var headers = new Headers(),
        pairs = trim( xhr.getAllResponseHeaders() ).split( '\n' ),
        len = pairs.len,
        i = 0,
        header, index;

    for ( ; i < len; ++i ) {
      if ( !( header = pairs[ i ] ) ||
        ( index = trim( header ).indexOf( ':' ) ) < 0 )
      {
        continue;
      }

      headers.append(
        trim( header.slice( 0, index ) ),
        trim( header.slice( index ) ) );
    }

    return headers;
  };

  Response = function ( body, options ) {
    if ( options !== undefined ) {
      init_body( this, body, options );

      if ( options.headers && options.headers instanceof Headers ) {
        this.headers = options.headers;
      } else {
        this.headers = new Headers( options.headers );
      }

      if ( options.url ) {
        this.url = options.url;
      }

      this.statusText = options.statusText;
      this.status = options.status;
      this.ok = this.status >= 200 && this.status < 300;
    } else {
      init_body( this, body, {} );
      this.headers = new Headers();
    }
  };

  var response_options = {
    status: 0,
    statusText: ''
  };

  Response.error = function () {
    var response = new Response( null, response_options );
    response.type = 'error';
    return response;
  };

  Response.redirect = function ( url, status ) {
    if ( status !== 301 &&
      status !== 302 &&
      status !== 303 &&
      status !== 307 &&
      status !== 308 )
    {
      throw RangeError( 'Invalid status code' );
    }

    var response = new Response( null, {
      headers: {
        location: url
      },

      status: status
    } );

    response.redirected = true;

    return response;
  };

  Response.prototype.clone = function () {
    return new Response( this._initial_body, {
      statusText: this.statusText,
      headers: new Headers( this.headers ),
      status: this.status,
      url: this.url
    } );
  };

  Response.prototype.type = 'default';
  Response.prototype.url = '';
  Response.prototype.ok = Response.redirected = false;

  if ( support.blob ) {
    Request.prototype.blob = Response.prototype.blob = function () {
      var value = consumed( this );

      if ( value ) {
        return value;
      }

      if ( ( value = this._blob ) ) {
        return Promise.resolve( value );
      }

      if ( this._form_data ) {
        throw Error( 'could not read FormData body as blob' );
      }

      return Promise.resolve( new Blob( [ this._text ] ) );
    };

    Request.prototype.text = Response.prototype.text = function() {
      var value = consumed( this );

      if ( value ) {
        return value;
      }

      if ( ( value = this._blob ) ) {
        return read_blob_as_text( value, this._options );
      }

      if ( this._form_data ) {
        throw Error( 'could not read FormData body as blob' );
      }

      return Promise.resolve( this._text );
    };

    Request.prototype.arrayBuffer = Response.prototype.arrayBuffer = function() {
      return this.blob().then( read_blob_as_array_buffer );
    };
  } else {
    Request.prototype.text = Response.prototype.text = function () {
      return consumed( this ) || Promise.resolve( this._text );
    };
  }

  if ( support.formData ) {
    var decode = function ( body ) {
      body = trim( body ).split( '&' );

      var i = 0,
          len = body.length,
          form = new FormData(),
          bytes, index;

      for ( ; i < len; ++i ) {
        if ( !( bytes = body[ i ] ) ||
          ( index = bytes.indexOf( '=' ) ) < 0 )
        {
          continue;
        }

        form.append(
          decodeURIComponent( trim( bytes.slice( 0, index ) ) ),
          decodeURIComponent( trim( bytes.slice( index ) ) ) );
      }

      return form;
    };

    Request.prototype.formData = Response.prototype.formData = function () {
      return this.text().then( decode );
    };
  }

  Request.prototype.json = Response.prototype.json = function () {
    return this.text().then( JSON.parse );
  };

  Request.prototype.bodyUsed = Response.prototype.bodyUsed = false;

  var responseURL = function () {
    if ( has( 'responseURL', this ) ) {
      return this.responseURL;
    }

    // Avoid security warnings on getResponseHeader when not allowed by CORS
    if ( /^X-Request-URL:/m.test( this.getAllResponseHeaders() ) ) {
      return this.getResponseHeader( 'X-Request-URL' );
    }
  };

  var set_request_header = function( value, name ) {
    this.setRequestHeader( name, value );
  };

  fetch = function ( url, options ) {
    return new Promise( function ( resolve, reject ) {
      var request = !options && isPrototypeOf.call( Request.prototype, url ) ? url : new Request( url, options ),
          xhr = new XMLHttpRequest(),
          loaded = false;
          // ^ for what uses this flag?

      xhr.onreadystatechange = function () {
        if ( loaded || this.readyState !== 4 ) {
          return;
        }

        loaded = true;

        var status = this.status,
            options, body;

        // normalize status code in IE
        // https://stackoverflow.com/questions/10046972/
        if ( status === 1223 ) {
          status = 204;
        }

        if ( status < 100 || status > 599 ) {
          return reject( TypeError( 'Network request failed' ) );
        }

        if ( has( 'response', this ) ) {
          body = this.response;
        } else {
          body = this.responseText;
        }

        options = {
          statusText: this.statusText,
          headers: headers( this ),
          status: status,
          url: responseURL.call( this )
        };

        resolve( new Response( body, options ) );
      };

      xhr.open( request.method, request.url, true );

      // `withCredentials` should be setted after calling `.open` in IE10
      // http://stackoverflow.com/a/19667959/1219343
      if ( request.credentials === 'include' ) {
        try {
          if ( has( 'withCredentials', xhr ) ) {
            xhr.withCredentials = true;
          } else {
            warn( 'withCredentials is not supported, you can ignore this warning' );
          }
        } catch ( ex ) {
          warn( 'set withCredentials error:' + ex );
        }
      }

      if ( support.blob && has( 'responseType', xhr ) ) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach( set_request_header, xhr );
      xhr.send( request._initial === undefined ? null : request._initial );
    } );
  };
} else {
  fetch = function ( a, b ) {
    return window.fetch( a, b );
  };

  Headers = window.Headers;
  Request = window.Request;
  Response = window.Response;
}

prototype.css = prototype.style;
prototype.val = prototype.value;
peako.getComputedStyle = getComputedStyle;
peako.lowerFirst = lowerFirst;
peako.upperFirst = upperFirst;
peako.style = getStyle;
peako.access = accessor;
peako.assign = assign;
peako.assignIn = assignIn;
peako.before = before;
peako.bind = bind;
peako.bindFast = bindFast;
peako.ceil = ceil;
peako.clamp = clamp;
peako.clone = clone;
peako.cloneArray = cloneArray;
peako.compact = compact;
peako.constant = constant;
peako.create = create;
peako.defaults = defaults;
peako.defaultTo = defaultTo;
peako.defineProperties = defineProperties;
peako.defineProperty = defineProperty;
peako.each = each;
peako.eachRight = eachRight;
peako.equal = peako.eq = equal;
peako.every = every;
peako.exec = exec;
peako.file = file;
peako.fill = fill;
peako.filter = filter;
peako.filterIn = filterIn;
peako.find = find;
peako.findIndex = findIndex;
peako.findLast = findLast;
peako.findLastIndex = findLastIndex;
peako.flatten = flatten;
peako.floor = floor;
peako.forEach = forEach;
peako.forEachRight = forEachRight;
peako.forIn = forIn;
peako.forInRight = forInRight;
peako.forOwn = forOwn;
peako.forOwnRight = forOwnRight;
peako.fromPairs = fromPairs;
peako.getPrototypeOf = getPrototypeOf;
peako.identity = identity;
peako.includes = includes;
peako.indexOf = indexOf;
peako.invert = invert;
peako.isArray = isArray;
peako.isArrayLike = isArrayLike;
peako.isArrayLikeObject = isArrayLikeObject;
peako.isBoolean = isBoolean;
peako.isFinite = isFinite;
peako.isFunction = isFunction;
peako.isElement = isElement;
peako.isElementLike = isElementLike;
peako.isLength = isLength;
peako.isNaN = isNaN;
peako.isNumber = isNumber;
peako.isObject = isObject;
peako.isObjectLike = isObjectLike;
peako.isPlainObject = isPlainObject;
peako.isPrimitive = isPrimitive;
peako.isSafeInteger = isSafeInteger;
peako.isDOMElement = isDOMElement;
peako.isString = isString;
peako.isSymbol = isSymbol;
peako.isWindow = isWindow;
peako.isWindowLike = isWindowLike;
peako.keys = getKeys;
peako.keysIn = getKeysIn;
peako.last = last;
peako.lastIndexOf = lastIndexOf;
peako.map = map;
peako.mapIn = mapIn;
peako.mapRight = mapRight;
peako.merge = merge;
peako.method = peako.call = method;
peako.mixin = peako.extend = mixin;
peako.noConflict = noConflict;
peako.noop = noop;
peako.now = getTime;
peako.nth = nth;
peako.nthArg = nthArg;
peako.once = once;
peako.parseHTML = parseHTML;
peako.property = peako.prop = property;
peako.random = random;
peako.range = range;
peako.rangeRight = rangeRight;
peako.reduce = reduce;
peako.reduceRight = reduceRight;
peako.reject = reject;
peako.rejectIn = rejectIn;
peako.round = round;
peako.sample = sample;
peako.sampleSize = sampleSize;
peako.setPrototypeOf = setPrototypeOf;
peako.shuffle = shuffle;
peako.slice = slice;
peako.some = some;
peako.times = times;
peako.timestamp = timestamp;
peako.toArray = toArray;
peako.toIndex = toIndex;
peako.toObject = toObject;
peako.toPairs = peako.entries = toPairs;
peako.toPairsIn = peako.entriesIn = toPairsIn;
peako.toPlainObject = toPlainObject;
peako.trim = trim;
peako.trimEnd = trimEnd;
peako.trimStart = trimStart;
peako.type = getType;
peako.unique = unique;
peako.values = getValues;
peako.valuesIn = getValuesIn;
peako.without = without;
peako.fetch = fetch;
peako.cssNumbers = cssNumbers;
peako.eventProps = event_props;
peako.propNames = propNames;
peako.support = support;
peako.wrapMap = wrapMap;
peako.event = event;
peako.DOMWrapper = DOMWrapper;
peako.Event = Event;
peako.Promise = Promise;
peako.Headers = Headers;
peako.Request = Request;
peako.Response = Response;
peako.timer = timer;
window.peako = window._ = peako;

} )( this );
