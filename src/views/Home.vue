<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CategoryList from '@/components/CategoryList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'Home',

  components: {
    CategoryList
  },

  mixins: [asyncDataStatus],

  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },

  created () {
    this.fetchAllCategories()
      .then(categories => Promise.all(categories.map(category => this.fetchForums({ ids: category.forums }))))
      .then(() => { this.asyncDataStatus_fetched() })
  },

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  }
}
</script>
