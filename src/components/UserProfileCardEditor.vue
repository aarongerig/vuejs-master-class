<template>
  <div class="col-3 push-top">
    <div class="profile-card">
      <p class="text-center">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="avatar-xlarge img-update"
        >
      </p>

      <div class="form-group">
        <input
          v-model.lazy="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
          aria-label="Username"
          @blur="$v.activeUser.username.$touch()"
        >
        <template v-if="$v.activeUser.username.$error">
          <span
            v-if="!$v.activeUser.username.required"
            class="form-error"
          >This field is required</span>
          <span
            v-else-if="!$v.activeUser.username.unique"
            class="form-error"
          >Sorry! This username is taken</span>
        </template>
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
          aria-label="Full Name"
          @blur="$v.activeUser.name.$touch()"
        >
        <template v-if="$v.activeUser.name.$error">
          <span
            v-if="!$v.activeUser.name.required"
            class="form-error"
          >This field is required</span>
        </template>
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          id="user_bio"
          v-model="activeUser.bio"
          class="form-input"
          placeholder="Write a few words about yourself."
        />
      </div>

      <div class="stats">
        <span>{{ userPostsCount }} posts</span>
        <span>{{ userThreadsCount }} threads</span>
      </div>

      <hr>

      <div class="form-group">
        <label
          class="form-label"
          for="user_website"
        >
          Website
        </label>
        <input
          id="user_website"
          v-model="activeUser.website"
          class="form-input"
          autocomplete="off"
        >
      </div>

      <div class="form-group">
        <label
          class="form-label"
          for="user_email"
        >
          Email
        </label>
        <input
          id="user_email"
          v-model.lazy="activeUser.email"
          class="form-input"
          autocomplete="off"
          @blur="$v.activeUser.email.$touch()"
        >
        <template v-if="$v.activeUser.email.$error">
          <span
            v-if="!$v.activeUser.email.required"
            class="form-error"
          >This field is required</span>
          <span
            v-else-if="!$v.activeUser.email.email"
            class="form-error"
          >This is not a valid email address</span>
          <span
            v-else-if="!$v.activeUser.email.unique"
            class="form-error"
          >Sorry! This email is taken</span>
        </template>
      </div>

      <div class="form-group">
        <label
          class="form-label"
          for="user_location"
        >
          Location
        </label>
        <input
          id="user_location"
          v-model="activeUser.location"
          class="form-input"
          autocomplete="off"
        >
      </div>

      <div class="btn-group space-between">
        <button
          type="button"
          class="btn-ghost"
          @click.prevent="cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn-blue"
          @click.prevent="save"
        >
          Save
        </button>
      </div>
    </div>

    <p class="text-xsmall text-faded text-center">
      Member since june 2003, last visited 4 hours ago
    </p>
  </div>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import { uniqueEmail, uniqueUsername } from '@/utils/validators'
export default {
  name: 'UserProfileCardEditor',

  props: {
    user: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      activeUser: { ...this.user }
    }
  },

  computed: {
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },

    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    }
  },

  validations: {
    activeUser: {
      name: { required },
      username: {
        required,
        unique (value) {
          if (value.toLowerCase() === this.user.usernameLower) {
            return true
          }

          return uniqueUsername(value)
        }
      },
      email: {
        email,
        required,
        unique (value) {
          if (value.toLowerCase() === this.user.email) {
            return true
          }

          return uniqueEmail(value)
        }
      }
    }
  },

  methods: {
    cancel () {
      this.$router.push({ name: 'Profile' })
    },

    save () {
      this.$v.activeUser.$touch()

      if (this.$v.activeUser.$invalid) {
        return
      }

      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>

<style scoped>

</style>
