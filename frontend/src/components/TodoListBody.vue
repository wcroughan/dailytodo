<template>
  <div class="todo-list-body">
    <todo-item
      v-for="item in listItems"
      :modelValue="item.isDone"
      @update:modelValue="checkboxUpdate($event, item.id)"
      :key="item.id"
      :title="item.title"
    />
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";
export default {
  components: { TodoItem },
  name: "TodoListBody",
  props: {
    listItems: Array,
  },
  emits: ["checkboxStatesChanged", "itemAdded", "itemRemoved"],
  data() {
    return {};
  },
  methods: {
    checkboxUpdate(checkBoxState, id) {
      this.$emit("checkboxStatesChanged", checkBoxState, id);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-list-body {
  margin: auto;
  max-width: 600px;
}
</style>
