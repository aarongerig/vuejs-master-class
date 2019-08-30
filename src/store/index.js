import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import auth from './modules/auth'
import categories from './modules/categories'
import forums from './modules/forums'
import posts from './modules/posts'
import threads from './modules/threads'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},

  getters: {},

  mutations: {
    setItem (state, { resource, id, item }) {
      item['.key'] = id
      Vue.set(state[resource].items, id, item)
    }
  },

  actions: {
    fetchItem ({ commit, state }, { resource, id, emoji }) {
      console.log('🔥‍', emoji, id)

      return new Promise((resolve) => {
        firebase.database().ref(resource).child(id)
          .once('value', snapshot => {
            commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
            resolve(state[resource].items[id])
          })
      })
    },

    fetchItems ({ dispatch }, { resource, ids, emoji }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids)

      return Promise.all(ids.map(id => dispatch('fetchItem', { resource, id, emoji })))
    }
  },

  modules: {
    auth,
    categories,
    forums,
    posts,
    threads,
    users
  }
})
