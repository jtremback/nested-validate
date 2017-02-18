const test = require('tape')
const {
  isObjectOf,
  isArrayOf,
  isOptional,
  isRequired,
  customErrors
} = require('./index.js')

const isString = isRequired(n => typeof n === 'string')
const isNumber = isRequired(n => typeof n === 'number')

const isAddress = isObjectOf({
  street: isString,
  houseNumber: isNumber
})

const isMyType = isObjectOf({
  foo: isOptional(isString),
  bar: isNumber,
  arr: isArrayOf(isNumber),
  addresses: isOptional(isArrayOf(isAddress))
})

const isMyOtherType = isObjectOf({
  baz: isString,
  myType: isMyType
})

test('happy path', t => {
  t.plan(1)
  t.doesNotThrow(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        foo: '3',
        bar: 3,
        arr: [3, 3]
      }
    })
  })
})

test('missing array', t => {
  t.plan(1)
  t.throws(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        foo: '3',
        bar: 3
        // arr: [3, 3]
      }
    })
  }, /myType -> arr -> missing/)
})

test('wrong type', t => {
  t.plan(1)

  t.throws(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        foo: 3,
        bar: 3,
        arr: [3, 3]
      }
    })
  }, /myType -> foo -> invalid/)
})

test('missing optional', t => {
  t.plan(1)
  t.doesNotThrow(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        // foo: 3,
        bar: 3,
        arr: [3, 3]
      }
    })
  })
})

test('array of objects', t => {
  t.plan(1)
  t.doesNotThrow(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        // foo: 3,
        bar: 3,
        arr: [3, 3],
        addresses: [
          {
            street: 'penny lane',
            houseNumber: 13
          }
        ]
      }
    })
  })
})

test('array of objects with wrong property', t => {
  t.plan(1)
  t.throws(() => {
    isMyOtherType({
      baz: 'dop',
      myType: {
        foo: 'derp',
        bar: 3,
        arr: [3, 3],
        addresses: [
          {
            street: 'penny lane',
            houseNumber: '13'
          }
        ]
      }
    })
  }, /myType -> addresses -> \[0\] -> houseNumber -> invalid/)
})

test('custom errors', t => {
  t.plan(2)
  const {
    isObjectOf,
    isArrayOf,
    isRequired
  } = customErrors({
    handleInvalid: () => {
      return new Error('dang')
    },
    handleMissing: () => {
      return new Error('crap')
    }
  })

  const isString = isRequired(n => typeof n === 'string')

  const isAwesomeCar = isObjectOf({
    whales: isArrayOf(isString)
  })

  t.throws(() => {
    isAwesomeCar({
      whales: [ 'beluga', 3 ]
    })
  }, /whales -> \[1\] -> dang/)

  t.throws(() => {
    isAwesomeCar({
      frond: 'gop'
    })
  }, /whales -> crap/)
})

test('throw on bad custom errors', t => {
  t.plan(1)
  t.throws(() => {
    customErrors({
      shibby: 'crunk'
    })
  }, /handleInvalid -> missing/)
})
