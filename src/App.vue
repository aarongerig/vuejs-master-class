<template>
  <div id="app">
    <TheNavbar />

    <div class="container">
      <router-view
        v-show="showPage"
        :key="$route.path"
        @ready="pageReady"
      />
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import NProgress from 'nprogress'
import AppSpinner from '@/components/AppSpinner'
import TheNavbar from '@/components/TheNavbar'

export default {
  name: 'App',

  components: {
    AppSpinner,
    TheNavbar
  },

  data () {
    return {
      showPage: false
    }
  },

  created () {
    NProgress.configure({ speed: 200, showSpinner: false })
    NProgress.start()

    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      NProgress.start()
      next()
    })
  },

  methods: {
    pageReady () {
      this.showPage = true
      NProgress.done()
    }
  }
}
</script>

<style lang="scss">
  @import 'assets/css/style.scss';
  @import '~nprogress/nprogress.css';

  #nprogress .bar {
    background: #57AD8D;
  }
</style>
