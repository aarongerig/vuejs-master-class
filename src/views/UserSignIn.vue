<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form
        class="card card-form"
        @submit.prevent="signIn"
      >
        <h1 class="text-center">
          Login
        </h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="text"
            class="form-input"
            @blur="$v.form.email.$touch()"
          >
          <template v-if="$v.form.email.$error">
            <span
              v-if="!$v.form.email.required"
              class="form-error"
            >This field is required</span>
            <span
              v-else-if="!$v.form.email.email"
              class="form-error"
            >This is not a valid email address</span>
          </template>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            @blur="$v.form.password.$touch()"
          >
          <template v-if="$v.form.password.$error">
            <span
              v-if="!$v.form.password.required"
              class="form-error"
            >This field is required</span>
            <span
              v-else-if="!$v.form.password.minLength"
              class="form-error"
            >The password must be at least 6 characters long</span>
          </template>
        </div>

        <div class="push-top">
          <button
            type="submit"
            class="btn-blue btn-block"
          >
            Log in
          </button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'UserRegistration' }">
            Create an account?
          </router-link>
        </div>
      </form>

      <div class="push-top text-center">
        <button
          class="btn-red btn-xsmall"
          @click="signInWithGoogle"
        >
          <i class="fa fa-google fa-btn" />
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { email, minLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'UserSignIn',

  data () {
    return {
      form: {
        email: null,
        password: null
      }
    }
  },

  validations: {
    form: {
      email: { email, required },
      password: { minLength: minLength(6), required }
    }
  },

  created () {
    this.$emit('ready')
  },

  methods: {
    signIn () {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) {
        return
      }

      this.$store.dispatch('auth/signInWithEmailAndPassword', {
        email: this.form.email,
        password: this.form.password
      })
        .then(() => this.successRedirect())
        .catch(error => alert(`🤷 ${error.message}`))
    },

    signInWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => this.successRedirect())
        .catch(error => alert(`🤷 ${error.message}`))
    },

    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  }
}
</script>

<style scoped>

</style>
