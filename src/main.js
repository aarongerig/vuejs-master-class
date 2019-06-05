import Vue from 'vue'
import firebase from 'firebase/app'
import App from './App.vue'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyAbHtPp7x-l-fUE-2plj4e8lA3JzL4n_2Y',
  authDomain: 'vuejs-forum-253c2.firebaseapp.com',
  databaseURL: 'https://vuejs-forum-253c2.firebaseio.com',
  projectId: 'vuejs-forum-253c2',
  storageBucket: 'vuejs-forum-253c2.appspot.com',
  messagingSenderId: '435284967069',
  appId: '1:435284967069:web:8c9bca8740097b98'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
