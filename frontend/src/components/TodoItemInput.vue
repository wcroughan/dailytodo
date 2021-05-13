<template>
  <div class="todo-item-input">
    <!-- <div class="todo-item-spacer" /> -->
    <div class="todo-item-input-field">
      <input v-model="inputText" placeholder="add new item" />
    </div>
    <div class="todo-item-add-button">
      <button @click="addClicked">Add</button>
    </div>
    <!-- <div class="todo-item-spacer" /> -->
    <!-- <br /> -->
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  data() {
    return {
      inputText: "",
    };
  },
  props: {},
  emits: ["addItem"],
  methods: {
    addClicked() {
      this.$emit("addItem", this.inputText);
      this.inputText = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-item-input-field {
  flex-grow: 1;
}
.todo-item-input {
  display: flex;
  justify-content: center;
  margin: 5px 0px;
}
</style>
