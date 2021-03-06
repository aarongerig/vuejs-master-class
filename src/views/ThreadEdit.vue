<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <thread-editor
      ref="editor"
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'ThreadEdit',

  components: {
    ThreadEditor
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    thread () {
      return this.$store.state.threads.items[this.id]
    },

    text () {
      const post = this.$store.state.posts.items[this.thread.firstPostId]

      return post ? post.text : null
    },

    hasUnsavedChanges () {
      return this.$refs.editor.form.title !== this.thread.title || this.$refs.editor.form.text !== this.text
    }
  },

  created () {
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
      .then(() => { this.asyncDataStatus_fetched() })
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost.')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },

  methods: {
    ...mapActions('posts', ['fetchPost']),
    ...mapActions('threads', ['fetchThread', 'updateThread']),

    save ({ title, text }) {
      this.updateThread({
        id: this.id,
        title,
        text
      }).then(() => {
        this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
      })
    },

    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  }
}
</script>

<style scoped>

</style>
