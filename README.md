# Nested-validate

This package lets you validate nested types at runtime, giving you error messages showing the path of the property that had the error. Build up the types using predicates like those found in [check-types](https://www.npmjs.com/package/check-types) or [prettycats](https://www.npmjs.com/package/prettycats). You can also create your own predicates.

```js
const {
        isObjectOf,
        isArrayOf,
        isOptional,
        isRequired
      } = require('nested-validate');

const isString = isRequired(n => typeof n === 'string');
const isNumber = isRequired(n => typeof n === 'number');

const isAddress = isObjectOf({
  street      : isString,
  houseNumber : isNumber
});

const isMyType = isObjectOf({
  foo       : isOptional(isString),
  bar       : isNumber,
  arr       : isArrayOf(isNumber),
  addresses : isOptional(isArrayOf(isAddress))
});

const isMyOtherType = isObjectOf({
  baz    : isString,
  myType : isMyType
});

isMyOtherType({
  baz    : 'dop',
  myType : {
    foo       : 'derp',
    bar       : 3,
    arr       : [3, 3],
    addresses : [
      {
        street      : 'penny lane',
        houseNumber : '13' // <- this property should be a number
      }
    ]
  }
});

// Will throw: 'myType addresses [0] houseNumber invalid'

```

## Custom error handlers

You can give this package an object with custom error handlers for missing and invalid errors.

```js
const {
        isObjectOf,
        isArrayOf,
        isRequired
      } = customErrors({
  handleInvalid : () => {
    return new Error('dang');
  },
  handleMissing : () => {
    return new Error('crap');
  }
});

const isString = isRequired(n => typeof n === 'string');

const isAwesomeCar = isObjectOf({
  whales : isArrayOf(isString)
});

isAwesomeCar({
  whales : ['beluga', 3] // <- 3 is not a string
});

// Will throw: 'whales [1] dang'
```
