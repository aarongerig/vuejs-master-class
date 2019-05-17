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
      const postId = 'greatPost' + Math.random()
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.threadId,
        userId: 'L664y3qZSubDbT1R6npC0EEybJ73',
        '.key': postId
      }

      this.text = ''

      this.$emit('save', { post })
    }
  }
}
</script>

<style scoped>

</style>
