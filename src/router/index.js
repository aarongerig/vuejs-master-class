import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Category from '@/views/CategoryShow'
import Forum from '@/views/ForumShow'
import ThreadShow from '@/views/ThreadShow'
import ThreadCreate from '@/views/ThreadCreate'
import ThreadEdit from '@/views/ThreadEdit'
import Profile from '@/views/ProfileShow'
import UserRegistration from '@/views/UserRegistration'
import UserSignIn from '@/views/UserSignIn'
import NotFound from '@/views/NotFound'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: { edit: true },
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'UserRegistration',
      component: UserRegistration,
      meta: { requiresGuest: true }
    },
    {
      path: '/sign-in',
      name: 'UserSignIn',
      component: UserSignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/sign-out',
      name: 'UserSignOut',
      meta: { requiresAuth: true },
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(() => next({ name: 'Home' }))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(`🚦 navigating to ${to.name} from ${from.name}`)
  store.dispatch('auth/initAuthentication')
    .then(user => {
      if (to.matched.some(route => route.meta.requiresAuth)) {
        if (user) {
          next()
        } else {
          next({ name: 'UserSignIn', query: { redirectTo: to.path } })
        }
      } else if (to.matched.some(route => route.meta.requiresGuest)) {
        if (!user) {
          next()
        } else {
          next({ name: 'Home' })
        }
      } else {
        next()
      }
    })
})

export default router
