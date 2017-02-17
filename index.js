const isObjectOf = schema => obj => {
    if (obj === undefined) {
        throw new Error('missing')
    }
    Object.keys(schema).forEach(key => {
        const value = obj[key]
        const predicate = schema[key]
        try {
            if (predicate(value) === false) {
                throw new Error('invalid')
            }
        } catch(err) {
            throw new Error(`${key} ${err.message}`)
        }
    })
    
    return true
}

const isArrayOf = predicate => arr => {
    if (arr === undefined) {
        throw new Error('missing')
    }
    arr.forEach((value, i) => {
        try {
            if (predicate(value) === false) {
                throw new Error('invalid')
            }
        } catch(err) {
            throw new Error(`[${i}] ${err.message}`)
        }
    })
}

const isRequired = predicate => value => {
    if (value === undefined) {
        throw new Error('missing')
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

module.exports = {
  isObjectOf,
  isArrayOf,
  isRequired,
  isOptional
}