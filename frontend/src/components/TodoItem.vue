<template>
  <div class="todo-item">
    <!-- <div class="todo-item-spacer" /> -->
    <div class="todo-item-checkbox">
      <input
        id="doneBox"
        type="checkbox"
        @change="changeFunc($event)"
        :checked="modelValue"
      />
    </div>
    <div class="todo-item-title">
      <component :is="modelValue ? 's' : 'b'">{{ title }}</component>
    </div>
    <div class="todo-item-remove-button">
      <button @click="$emit('remove')">Remove</button>
    </div>
    <!-- <div class="todo-item-spacer" /> -->
    <!-- <br /> -->
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  data() {
    return {};
  },
  props: {
    title: String,
    modelValue: Boolean,
  },
  emits: ["update:modelValue", "remove"],
  mounted() {
    // console.log(this.title, this.modelValue);
  },
  methods: {
    changeFunc(arg) {
      this.$emit("update:modelValue", arg.target.checked);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-item-title {
  flex-grow: 1;
}
.todo-item {
  display: flex;
  justify-content: center;
  margin: 5px 0px;
}
</style>
