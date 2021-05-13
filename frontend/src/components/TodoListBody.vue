<template>
  <div class="todo-list-body">
    <todo-item
      v-for="item in listItems"
      :modelValue="item.isDone"
      @update:modelValue="checkboxUpdate($event, item.id)"
      @remove="removeItem(item.id)"
      :key="item.id"
      :title="item.title"
    />
    <todo-item-input @addItem="addItem($event)" />
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";
import TodoItemInput from "./TodoItemInput.vue";
export default {
  components: { TodoItem, TodoItemInput },
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
      const emitBody = {
        id: id,
        checkBoxState: checkBoxState,
      };
      this.$emit("checkboxStatesChanged", emitBody);
    },
    addItem(item) {
      this.$emit("itemAdded", item);
    },
    removeItem(item) {
      this.$emit("itemRemoved", item);
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
