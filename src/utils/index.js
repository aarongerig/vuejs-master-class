const countObjectProperties = object => {
  if (typeof object === 'object') {
    return Object.keys(object).length
  }

  return 0
}

const removeEmptyProperties = object => {
  const objectCopy = { ...object }
  Object.keys(objectCopy).forEach(key => {
    if (!objectCopy[key]) {
      delete objectCopy[key]
    }
  })

  return objectCopy
}

export {
  countObjectProperties,
  removeEmptyProperties
}
