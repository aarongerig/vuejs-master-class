import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
  },

  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },

  mutations: {
    appendPostToThread (state, { threadId, postId }) {
      const thread = state.threads[threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },

    appendPostToUser (state, { userId, postId }) {
      const user = state.users[userId]
      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }
      Vue.set(user.posts, postId, postId)
    },

    appendThreadToForum (state, { forumId, threadId }) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },

    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    },

    setPost (state, { postId, post }) {
      Vue.set(state.posts, postId, post)
    },

    setThread (state, { threadId, thread }) {
      Vue.set(state.threads, threadId, thread)
    },

    setUser (state, { userId, user }) {
      Vue.set(state.users, userId, user)
    }
  },

  actions: {
    createPost ({ commit, state }, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', { postId, post })
      commit('appendPostToThread', { threadId: post.threadId, postId })
      commit('appendPostToUser', { userId: post.userId, postId })

      return Promise.resolve(state.posts[postId])
    },

    createThread ({ commit, dispatch, state }, { forumId, title, text }) {
      return new Promise((resolve, reject) => {
        const threadId = 'greatThread' + Math.random()
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = { '.key': threadId, forumId, title, publishedAt, userId }

        commit('setThread', { threadId, thread })
        commit('appendThreadToForum', { forumId, threadId })
        commit('appendThreadToUser', { userId, threadId })

        dispatch('createPost', { text, threadId })
          .then(post => {
            commit('setThread', { threadId, thread: { ...thread, firstPostId: post['.key'] } })
          })

        resolve(state.threads[threadId])
      })
    },

    updateThread ({ commit, state }, { id, title, text }) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]
        const post = state.posts[thread.firstPostId]

        const newThread = { ...thread, title }
        const newPost = { ...post, text }

        commit('setThread', { thread: newThread, threadId: id })
        commit('setPost', { thread: newPost, postId: thread.firstPostId })

        resolve(newThread)
      })
    },

    updateUser ({ commit }, user) {
      commit('setUser', { userId: user['.key'], user })
    }
  }
})
