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
      <div class="btn-group">
        <button
          v-if="isUpdate"
          class="btn btn-ghost"
          @click.prevent="cancel"
        >
          Cancel
        </button>
        <button class="btn-blue">
          {{ isUpdate ? 'Update' : 'Submit post' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostEditor',

  props: {
    post: {
      type: Object,
      default: null,
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string'
        const textIsValid = typeof obj.text === 'string'
        const valid = keyIsValid && textIsValid

        if (!keyIsValid) {
          console.error('😳 The post prop object must include a `.key` attribute.')
        }

        if (!textIsValid) {
          console.error('😳 The post prop object must include a `text` attribute.')
        }

        return valid
      }
    },

    threadId: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      text: this.post ? this.post.text : ''
    }
  },

  computed: {
    isUpdate () {
      return !!this.post
    }
  },

  methods: {
    cancel () {
      this.$emit('cancel')
    },

    save () {
      this.persist()
        .then(post => {
          this.$emit('save', { post })
        })
    },

    create () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      this.text = ''

      return this.$store.dispatch('createPost', post)
    },

    update () {
      const payload = {
        id: this.post['.key'],
        text: this.text
      }

      return this.$store.dispatch('updatePost', payload)
    },

    persist () {
      return this.isUpdate ? this.update() : this.create()
    }
  }
}
</script>

<style scoped>

</style>
