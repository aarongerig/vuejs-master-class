<template>
  <span :title="timestamp | humanFriendlyDate">{{ timestamp | diffForHumans }}</span>
</template>

<script>
import { distanceInWordsToNow, format, parse } from 'date-fns'

export default {
  name: 'AppDate',

  filters: {
    humanFriendlyDate (date) {
      return format(parse(date * 1000), 'MMMM Do YYYY, h:mm:ss a')
    },

    diffForHumans (date) {
      return `${distanceInWordsToNow(parse(date * 1000))} ago`
    }
  },

  props: {
    timestamp: {
      required: true,
      type: Number
    }
  }
}
</script>

<style scoped>

</style>
