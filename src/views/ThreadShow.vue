<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-large push-top"
  >
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a
        href="#"
        class="link-unstyled"
      >{{ user.name }}</a>, <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px;"
        class="hide-mobile text-faded text-small"
      >
        {{ repliesCount }} replies by {{ contributorsCount }} contributors
      </span>
    </p>
    <PostList :posts="posts" />
    <PostEditor
      v-if="authUser"
      :thread-id="id"
    />
    <div
      v-else
      class="text-center"
      style="margin-bottom: 50px"
    >
      <router-link :to="{ name: 'UserSignIn', query: { redirectTo: $route.path } }">
        Sign in
      </router-link> or
      <router-link :to="{ name: 'UserRegistration', query: { redirectTo: $route.path } }">
        register
      </router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PostEditor from '@/components/PostEditor'
import PostList from '@/components/PostList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { countObjectProperties } from '@/utils'

export default {
  name: 'ThreadShow',

  components: {
    PostEditor,
    PostList
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapGetters('auth', {
      authUser: 'authUser'
    }),

    thread () {
      return this.$store.state.threads.items[this.id]
    },

    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key'])
    },

    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    },

    user () {
      return this.$store.state.users.items[this.thread.userId]
    },

    posts () {
      const postIds = Object.values(this.thread.posts)

      return Object.values(this.$store.state.posts.items)
        .filter(post => postIds.includes(post['.key']))
    }
  },

  created () {
    this.fetchThread({ id: this.id })
      .then(thread => {
        this.fetchUser({ id: thread.userId })
        return this.fetchPosts({ ids: thread.posts })
      })
      .then(posts => {
        return Promise.all(posts.map(post => {
          this.fetchUser({ id: post.userId })
        }))
      })
      .then(() => { this.asyncDataStatus_fetched() })
  },

  methods: {
    ...mapActions('posts', ['fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUser'])
  }
}
</script>

<style scoped>

</style>
