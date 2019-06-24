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

Vue.use(Router)

export default new Router({
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
      props: true
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
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: { edit: true }
    },
    {
      path: '/register',
      name: 'UserRegistration',
      component: UserRegistration
    },
    {
      path: '/sign-in',
      name: 'UserSignIn',
      component: UserSignIn
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
