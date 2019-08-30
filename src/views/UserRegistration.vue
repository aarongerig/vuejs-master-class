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
            @blur="$v.form.name.$touch()"
          >
          <template v-if="$v.form.name.$error">
            <span
              v-if="!$v.form.name.required"
              class="form-error"
            >This field is required</span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model.lazy="form.username"
            type="text"
            class="form-input"
            @blur="$v.form.username.$touch()"
          >
          <template v-if="$v.form.username.$error">
            <span
              v-if="!$v.form.username.required"
              class="form-error"
            >This field is required</span>
            <span
              v-else-if="!$v.form.username.unique"
              class="form-error"
            >Sorry! This username is taken</span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.lazy="form.email"
            type="email"
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
            <span
              v-else-if="!$v.form.email.unique"
              class="form-error"
            >Sorry! This email is taken</span>
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
              v-else-if="!$v.form.email.minLength"
              class="form-error"
            >The password must be at least 6 characters long</span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            id="avatar"
            v-model="form.avatar"
            type="text"
            class="form-input"
            @blur="$v.form.avatar.$touch()"
          >
          <template v-if="$v.form.avatar.$error">
            <span
              v-if="!$v.form.avatar.url"
              class="form-error"
            >This is not a valid url</span>
          </template>
        </div>

        <div class="form-actions">
          <button class="btn-blue btn-block">
            Register
          </button>
        </div>
      </form>
      <div class="text-center push-top">
        <button
          class="btn-red btn-xsmall"
          @click="registerWithGoogle"
        >
          <i class="fa fa-google fa-btn" />Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import {
  email,
  helpers as vuelidateHelpers,
  minLength,
  required,
  url
} from 'vuelidate/lib/validators'

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

  validations: {
    form: {
      name: { required },
      username: {
        required,
        unique (value) {
          if (!vuelidateHelpers.req(value)) {
            return true
          }

          return new Promise((resolve) => {
            firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
              .once('value', snapshot => resolve(!snapshot.exists()))
          })
        }
      },
      email: {
        email,
        required,
        unique (value) {
          if (!vuelidateHelpers.req(value)) {
            return true
          }

          return new Promise((resolve) => {
            firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
              .once('value', snapshot => resolve(!snapshot.exists()))
          })
        }
      },
      password: { minLength: minLength(6), required },
      avatar: { url }
    }
  },

  created () {
    this.$emit('ready')
  },

  methods: {
    register () {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) {
        return
      }

      this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
        .then(() => this.successRedirect())
    },

    registerWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => this.successRedirect())
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
