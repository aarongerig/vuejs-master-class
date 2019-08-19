import Vue from 'vue'

const makeAppendChildToParentMutation = ({ parent, child }) => (state, { parentId, childId }) => {
  const resource = state[parent][parentId]
  if (!resource[child]) {
    Vue.set(resource, child, {})
  }
  Vue.set(resource[child], childId, childId)
}

export default {
  appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),

  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),

  appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),

  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),

  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),

  setAuthId (state, id) {
    state.authId = id
  },

  setItem (state, { resource, id, item }) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  setPost (state, { postId, post }) {
    Vue.set(state.posts, postId, post)
  },

  setThread (state, { threadId, thread }) {
    Vue.set(state.threads, threadId, thread)
  },

  setUnsubscribeAuthObserver (state, unsubscribe) {
    state.unsubscribeAuthObserver = unsubscribe
  },

  setUser (state, { userId, user }) {
    Vue.set(state.users, userId, user)
  }
}
