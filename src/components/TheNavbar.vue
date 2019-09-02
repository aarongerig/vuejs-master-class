<template>
  <header
    id="header"
    v-click-outside="closeMobileNavbar"
    v-handle-scroll="closeMobileNavbar"
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

    <div
      class="btn-hamburger"
      @click="mobileNavOpen = !mobileNavOpen"
    >
      <div class="top bar" />
      <div class="middle bar" />
      <div class="bottom bar" />
    </div>

    <nav
      class="navbar"
      :class="{ 'navbar-open': mobileNavOpen }"
    >
      <ul v-if="user">
        <li
          v-click-outside="closeUserDropdown"
          class="navbar-user"
        >
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
          <div
            id="user-dropdown"
            :class="{ 'active-drop': userDropdownOpen }"
          >
            <div class="triangle-drop" />
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }">
                  View Profile
                </router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/signOut')">Sign out</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="navbar-item mobile-only">
          <router-link :to="{ name: 'Profile' }">
            View Profile
          </router-link>
        </li>
        <li class="navbar-item mobile-only">
          <a @click.prevent="$store.dispatch('auth/signOut')">
            Sign Out
          </a>
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
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import clickOutside from '@/directives/click-outside'
import handleScroll from '@/directives/handle-scroll'

export default {
  name: 'TheNavbar',

  directives: {
    clickOutside,
    handleScroll
  },

  data () {
    return {
      mobileNavOpen: false,
      userDropdownOpen: false
    }
  },

  computed: {
    ...mapGetters('auth', {
      user: 'authUser'
    })
  },

  methods: {
    closeMobileNavbar () {
      this.mobileNavOpen = false
    },

    closeUserDropdown () {
      this.userDropdownOpen = false
    }
  }
}
</script>

<style scoped>

</style>
