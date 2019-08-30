<template>
  <header
    id="header"
    class="header"
  >
    <router-link
      :to="{ name: 'Home' }"
      class="logo"
    >
      <img
        src="../assets/img/vueschool-logo.svg"
        alt=""
      >
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar" />
      <div class="middle bar" />
      <div class="bottom bar" />
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul v-if="user">
        <li class="navbar-user">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen">
            <img
              class="avatar-small"
              :src="user.avatar"
              alt=""
            >
            <span>
              {{ user.name }}
              <img
                class="icon-profile"
                src="../assets/img/arrow-profile.svg"
                alt=""
              >
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div
            id="user-dropdown"
            :class="{ 'active-drop': userDropdownOpen }"
          >
            <div class="triangle-drop" />
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }">
                  View profile
                </router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/signOut')">Sign out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{ name: 'UserSignIn' }">
            Sign In
          </router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{ name: 'UserRegistration' }">
            Register
          </router-link>
        </li>
      </ul>

      <ul>
        <li class="navbar-item">
          <router-link :to="{ name: 'Home' }">
            Home
          </router-link>
        </li>
        <li class="navbar-item">
          <a href="#">Category</a>
        </li>
        <li class="navbar-item">
          <a href="#">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="#">Thread</a>
        </li>
        <!-- Show these option only on mobile-->
        <li class="navbar-item mobile-only">
          <a href="#">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a @click.prevent="$store.dispatch('auth/signOut')">Sign out</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TheNavbar',

  data () {
    return {
      userDropdownOpen: false
    }
  },

  computed: {
    ...mapGetters('auth', {
      user: 'authUser'
    })
  }
}
</script>

<style scoped>

</style>
