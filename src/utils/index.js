import Vue from 'vue'

const countObjectProperties = object => {
  if (typeof object === 'object') {
    return Object.keys(object).length
  }

  return 0
}

const makeAppendChildToParentMutation = ({ child }) => (state, { parentId, childId }) => {
  const resource = state.items[parentId]
  if (!resource[child]) {
    Vue.set(resource, child, {})
  }
  Vue.set(resource[child], childId, childId)
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
  makeAppendChildToParentMutation,
  removeEmptyProperties
}
