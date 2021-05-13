
<template>
  <button class="date-element" @click="$emit('click')">
    {{ displayText }}<br />Done: {{ isDone }}<br />Skipped: {{ isSkipped }}
  </button>
</template>

<script>
export default {
  name: "DateElement",
  emits: ["click"],
  props: {
    displayText: String,
    isDone: Boolean,
    isSkipped: Boolean,
  },
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
