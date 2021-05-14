
<template>
  <button
    class="date-element"
    :class="{ isDone: isDone, isSkipped: isSkipped, isSelected: isSelected }"
    @click="$emit('click')"
  >
    {{ displayText }}
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
    isSelected: Boolean,
  },
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  background-color: white;
  border-color: seashell;
  border-radius: 12%;
  margin: 3px;
  padding: 10px 0px;
  font-size: 20px;
  text-align: center;
}

button.isDone {
  background-color: aqua;
}

button.isSelected {
  /* box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
  border-color: silver;
  border-width: 3px;
}

button.isSkipped {
  background-color: gray;
}
</style>
