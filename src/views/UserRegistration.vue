<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form
        class="card card-form"
        @submit.prevent="register"
      >
        <h1 class="text-center">
          Register
        </h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            id="avatar"
            v-model="form.avatar"
            type="text"
            class="form-input"
          >
        </div>

        <div class="form-actions">
          <button class="btn-blue btn-block">
            Register
          </button>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn" />Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegistration',

  data () {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    }
  },

  created () {
    this.$emit('ready')
  },

  methods: {
    register () {
      console.log(this.form)
      this.$store.dispatch('createUser', this.form)
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>

</style>