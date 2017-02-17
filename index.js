let standardErrors = {
  handleInvalid: () => new Error('invalid'),
  handleMissing: () => new Error('missing')
}

const isObjectOf = errors => schema => obj => {
  if (obj === undefined) {
    throw errors.handleMissing()
  }
  Object.keys(schema).forEach(key => {
    const value = obj[key]
    const predicate = schema[key]
    try {
      if (predicate(value) === false) {
        throw errors.handleInvalid()
      }
    } catch (err) {
      const _err = new Error()

      _err.message = `${key} -> ${err.message}`
      _err.code = err.code

      throw _err
    }
  })

  return true
}

const isArrayOf = errors => predicate => arr => {
  if (arr === undefined) {
    throw errors.handleMissing()
  }
  arr.forEach((value, i) => {
    try {
      if (predicate(value) === false) {
        throw errors.handleInvalid()
      }
    } catch (err) {
      const _err = new Error()

      _err.message = `[${i}] -> ${err.message}`
      _err.code = err.code

      throw _err
    }
  })
}

const isRequired = errors => predicate => value => {
  if (value === undefined) {
    throw errors.handleMissing()
  } else {
    return predicate(value)
  }
}

const isOptional = predicate => value => {
  if (value === undefined) {
    return true
  } else {
    return predicate(value)
  }
}

const isFunction = isRequired(standardErrors)(a => {
  if (typeof a !== 'function') {
    throw new Error('must be function')
  }
  return true
})
const isCustomErrors = isObjectOf(standardErrors)({
  handleInvalid: isFunction,
  handleMissing: isFunction
})

module.exports = {
  isObjectOf: isObjectOf(standardErrors),
  isArrayOf: isArrayOf(standardErrors),
  isRequired: isRequired(standardErrors),
  isOptional,
  customErrors: (errors) => {
    isCustomErrors(errors)
    return {
      isObjectOf: isObjectOf(errors),
      isArrayOf: isArrayOf(errors),
      isRequired: isRequired(errors),
      isOptional
    }
  }
}
