<template>
  <div class="col-full push-top">
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
import ThreadEditor from '@/components/ThreadEditor'

export default {
  name: 'ThreadEdit',

  components: {
    ThreadEditor
  },

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
      // FIXME: Cannot read property text of undefined
      return this.$store.state.posts[this.thread.firstPostId].text
    }
  },

  methods: {
    save ({ title, text }) {
      this.$store.dispatch('updateThread', {
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
