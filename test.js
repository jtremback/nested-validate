const test = require('blue-tape')
const {
  isObjectOf,
  isArrayOf,
  isOptional,
  isRequired
} = require('./index.js')
// const awesomeErrorHandler = predicate => value => {
//     try {
//         predicate(value)
//     } catch(err) {
//         const err = new Error(`Holy crap: ${err.message}`)
//         err.code = 7002
//         throw err
//     }
// }
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
  isMyOtherType({
    baz: 'dop',
    myType:{
      foo: '3',
      bar: 3,
      arr: [3, 3]
    }
  })

  t.end()
})

test('missing array', t => {
  try {
    isMyOtherType({
      baz: 'dop',
      myType:{
        foo: '3',
        bar: 3,
        // arr: [3, 3]
      }
    })
  } catch (err) {
    t.equal(err.message, 'myType arr missing')
  }

  t.end()
})

test('wrong type', t => {
  try {
    isMyOtherType({
      baz: 'dop',
      myType:{
        foo: 3,
        bar: 3,
        arr: [3, 3]
      }
    })
  } catch (err) {
    t.equal(err.message, 'myType foo invalid')
  }

  t.end()
})

test('missing optional', t => {
  try {
    isMyOtherType({
      baz: 'dop',
      myType:{
        // foo: 3,
        bar: 3,
        arr: [3, 3]
      }
    })
  } catch (err) {
    t.notOk(err.message)
  }

  t.end()
})

test('array of objects', t => {
  try {
    isMyOtherType({
      baz: 'dop',
      myType:{
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
  } catch (err) {
    t.notOk(err.message)
  }

  t.end()
})

test('array of objects with wrong property', t => {
  try {
    isMyOtherType({
      baz: 'dop',
      myType:{
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
  } catch (err) {
    t.equal(err.message, 'myType addresses [0] houseNumber invalid')
  }

  t.end()
})