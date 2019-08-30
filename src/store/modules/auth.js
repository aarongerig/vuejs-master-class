import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },

  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },

    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  },

  actions: {
    fetchAuthUser ({ dispatch, commit }) {
      const userId = firebase.auth().currentUser.uid

      return new Promise((resolve) => {
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('users/fetchUser', { id: userId }, { root: true })
              .then(user => {
                commit('setAuthId', userId)
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    },

    initAuthentication ({ commit, dispatch, state }) {
      return new Promise((resolve) => {
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('👣 the user has changed')
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser))
          } else {
            resolve(null)
          }
        })
        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },

    registerUserWithEmailAndPassword ({ dispatch }, { email, name, username, password, avatar = null }) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(({ user }) => {
          return dispatch('users/createUser', { id: user.uid, email, name, username, password, avatar }, { root: true })
        })
        .then(() => dispatch('fetchAuthUser'))
    },

    signInWithEmailAndPassword (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()

      return firebase.auth().signInWithPopup(provider)
        .then(({ user }) => {
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) {
              return dispatch('users/createUser', {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                username: user.email,
                avatar: user.photoURL
              })
                .then(() => dispatch('fetchAuthUser'))
            }
          })
        })
    },

    signOut ({ commit }) {
      return firebase.auth().signOut()
        .then(() => {
          commit('setAuthId', null)
        })
    }
  }
}
