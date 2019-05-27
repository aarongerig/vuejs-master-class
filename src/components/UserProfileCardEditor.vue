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
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
          aria-label="Username"
        >
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
          aria-label="Full Name"
        >
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
          v-model="activeUser.email"
          class="form-input"
          autocomplete="off"
        >
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
export default {
  name: 'UserProfileCardEditor',

  props: {
    user: {
      required: true,
      type: Object
    },

    userPostsCount: {
      required: true,
      type: Number
    },

    userThreadsCount: {
      required: true,
      type: Number
    }
  },

  data () {
    return {
      activeUser: { ...this.user }
    }
  },

  methods: {
    cancel () {
      this.$router.push({ name: 'Profile' })
    },

    save () {
      this.$store.dispatch('updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>

<style scoped>

</style>
