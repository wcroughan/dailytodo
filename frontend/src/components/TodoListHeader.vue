<template>
  <div class="todo-list-header">
    <div class="todo-list-header-title">
      <h3>{{ title }}</h3>
    </div>
    <div class="todo-list-header-details">
      {{ numRemaining }}/{{ numItems }} Remaining
    </div>
  </div>
</template>

<script>
export default {
  name: "TodoListHeader",
  props: {
    title: String,
    numRemaining: Number,
    numItems: Number,
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-list-header {
  display: flex;
  justify-content: center;
  margin: auto;
  max-width: 600px;
}
.todo-list-header-title {
  flex-grow: 1;
}
.todo-list-header-details {
  flex-grow: 1;
}
</style>
