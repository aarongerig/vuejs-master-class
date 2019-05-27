<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea
        id=""
        v-model="text"
        name=""
        cols="30"
        rows="10"
        class="form-input"
        aria-label="New post text"
      />
    </div>
    <div class="form-actions">
      <button class="btn-blue">
        Submit post
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostEditor',

  props: {
    threadId: {
      required: true,
      type: String
    }
  },

  data () {
    return {
      text: ''
    }
  },

  methods: {
    save () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      this.text = ''

      this.$emit('save', { post })
      this.$store.dispatch('createPost', post)
    }
  }
}
</script>

<style scoped>

</style>
