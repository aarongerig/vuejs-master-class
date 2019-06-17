import Vue from 'vue'
import firebase from 'firebase/app'
import App from './App.vue'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  beforeCreate () {
    store.dispatch('fetchUser', { id: store.state.authId })
  },
  render: h => h(App)
}).$mount('#app')
