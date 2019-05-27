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
      Vue.set(thread.posts, postId, postId)
    },

    appendPostToUser (state, { userId, postId }) {
      const user = state.users[userId]
      Vue.set(user.posts, postId, postId)
    },

    setPost (state, { postId, post }) {
      Vue.set(state.posts, postId, post)
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
      commit('appendPostToThread', { threadId: post.threadId, post })
      commit('appendPostToUser', { userId: post.userId, post })
    },

    updateUser ({ commit }, user) {
      commit('setUser', { userId: user['.key'], user })
    }
  }
})
