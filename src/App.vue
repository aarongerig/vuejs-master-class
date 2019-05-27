<template>
  <div id="app">
    <TheNavbar />

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  name: 'App',

  components: {
    TheNavbar
  }
}
</script>

<style lang="scss">
  @import 'assets/css/style.scss';
</style>
