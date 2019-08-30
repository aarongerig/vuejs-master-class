import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import { countObjectProperties, makeAppendChildToParentMutation } from '@/utils'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    threadRepliesCount: state => id => countObjectProperties(state.items[id].posts) - 1
  },

  mutations: {
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),

    setThread (state, { threadId, thread }) {
      Vue.set(state.items, threadId, thread)
    }
  },

  actions: {
    createThread ({ commit, dispatch, state, rootState }, { forumId, title, text }) {
      return new Promise((resolve) => {
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = rootState.auth.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = { forumId, title, publishedAt, userId, firstPostId: postId, posts: {} }
        thread.posts[postId] = postId
        const post = { text, publishedAt, threadId, userId }

        const updates = {}
        updates[`threads/${threadId}`] = thread
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        updates[`users/${userId}/threads/${threadId}`] = threadId

        updates[`posts/${postId}`] = post
        updates[`users/${userId}/posts/${postId}`] = postId

        firebase.database().ref().update(updates)
          .then(() => {
            // update thread
            commit('setItem', { resource: 'threads', id: threadId, item: thread }, { root: true })
            commit('forums/appendThreadToForum', { parentId: forumId, childId: threadId }, { root: true })
            commit('users/appendThreadToUser', { parentId: userId, childId: threadId }, { root: true })
            // update post
            commit('setItem', { resource: 'posts', id: postId, item: post }, { root: true })
            commit('appendPostToThread', { parentId: post.threadId, childId: postId })
            commit('users/appendPostToUser', { parentId: post.userId, childId: postId }, { root: true })

            resolve(state.items[threadId])
          })
      })
    },

    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }, { root: true }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '🌧' }, { root: true }),

    updateThread ({ commit, dispatch, state, rootState }, { id, title, text }) {
      return new Promise((resolve) => {
        const thread = state.items[id]
        const post = rootState.posts.items[thread.firstPostId]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: rootState.auth.authId
        }

        const updates = {}
        updates[`posts/${thread.firstPostId}/text`] = text
        updates[`posts/${thread.firstPostId}/edited`] = edited
        updates[`threads/${id}/title`] = title

        firebase.database().ref().update(updates)
          .then(() => {
            commit('setThread', { thread: { ...thread, title }, threadId: id })
            commit('posts/setPost', { postId: thread.firstPostId, post: { ...post, text, edited } }, { root: true })
            resolve(post)
          })
      })
    }
  }
}
