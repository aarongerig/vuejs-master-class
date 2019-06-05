import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import { countObjectProperties } from '@/utils'

Vue.use(Vuex)

const makeAppendChildToParentMutation = ({ parent, child }) =>
  (state, { parentId, childId }) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
  },

  getters: {
    authUser (state) {
      // return state.users[state.authId]
      return {}
    },

    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1,

    userPostsCount: state => id => countObjectProperties(state.users[id].posts),

    userThreadsCount: state => id => countObjectProperties(state.users[id].threads)
  },

  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),

    appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),

    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),

    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),

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
      commit('appendPostToThread', { parentId: post.threadId, childId: postId })
      commit('appendPostToUser', { parentId: post.userId, childId: postId })

      return Promise.resolve(state.posts[postId])
    },

    createThread ({ commit, dispatch, state }, { forumId, title, text }) {
      return new Promise((resolve) => {
        const threadId = 'greatThread' + Math.random()
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = { '.key': threadId, forumId, title, publishedAt, userId }

        commit('setThread', { threadId, thread })
        commit('appendThreadToForum', { parentId: forumId, childId: threadId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })

        dispatch('createPost', { text, threadId })
          .then(post => {
            commit('setThread', { threadId, thread: { ...thread, firstPostId: post['.key'] } })
          })

        resolve(state.threads[threadId])
      })
    },

    updateThread ({ commit, dispatch, state }, { id, title, text }) {
      return new Promise((resolve) => {
        const thread = state.threads[id]
        const newThread = { ...thread, title }

        commit('setThread', { thread: newThread, threadId: id })
        dispatch('updatePost', { id: thread.firstPostId, text })
          .then(() => {
            resolve(newThread)
          })
      })
    },

    updatePost ({ commit, state }, { id, text }) {
      return new Promise((resolve) => {
        const post = state.posts[id]
        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          }
        })
        resolve(post)
      })
    },

    updateUser ({ commit }, user) {
      commit('setUser', { userId: user['.key'], user })
    },

    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' })
    },

    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id, emoji: '🌧' })
    },

    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' })
    },

    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' })
    },

    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' })
    },

    fetchCategories (context, { ids }) {
      return context.dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' })
    },

    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: '🌧' })
    },

    fetchThreads (context, { ids }) {
      return context.dispatch('fetchItems', { resource: 'threads', ids, emoji: '🌧' })
    },

    fetchPosts (context, { ids }) {
      return context.dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' })
    },

    fetchUsers (context, { ids }) {
      return context.dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
    },

    fetchAllCategories ({ commit, state }) {
      console.log('🔥‍', '🏷', 'all')

      return new Promise((resolve) => {
        firebase.database().ref('categories')
          .once('value', snapshot => {
            const categoriesObject = snapshot.val()
            Object.keys(categoriesObject).forEach(categoryId => {
              const category = categoriesObject[categoryId]
              commit('setItem', { resource: 'categories', id: categoryId, item: category })
              resolve(Object.values(state.categories))
            })
          })
      })
    },

    fetchItem ({ commit, state }, { resource, id, emoji }) {
      console.log('🔥‍', emoji, id)

      return new Promise((resolve) => {
        firebase.database().ref(resource).child(id)
          .once('value', snapshot => {
            commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
            resolve(state[resource][id])
          })
      })
    },

    fetchItems ({ dispatch }, { resource, ids, emoji }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids)

      return Promise.all(ids.map(id => dispatch('fetchItem', { resource, id, emoji })))
    }
  }
})
