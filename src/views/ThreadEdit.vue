<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <thread-editor
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
      return this.$store.state.threads[this.id]
    },

    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]

      return post ? post.text : null
    }
  },

  created () {
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
      .then(() => { this.asyncDataStatus_fetched() })
  },

  methods: {
    ...mapActions(['fetchPost', 'fetchThread', 'updateThread']),

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
