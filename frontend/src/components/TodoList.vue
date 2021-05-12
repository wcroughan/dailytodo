<template>
  <div class="todo-list">
    <todo-list-header
      :title="title"
      :deadline="deadline"
      :numRemaining="numRemaining"
      :numItems="numItems"
    />
    <todo-list-body
      :listItems="listItems"
      @checkboxStatesChanged="checkboxStatesChanged"
    />
    <todo-list-footer
      :isAllDone="isAllDone"
      @toggleAll="toggleAll"
      @loadDefault="loadDefault"
      @undoLoadDefault="undoLoadDefault"
      @saveDefault="saveDefault"
      @undoSaveDefault="undoSaveDefault"
    />
  </div>
</template>

<script>
import TodoListBody from "./TodoListBody.vue";
import TodoListFooter from "./TodoListFooter.vue";
import TodoListHeader from "./TodoListHeader.vue";

export default {
  name: "TodoList",
  props: {
    listId: String,
  },
  data() {
    return {
      deadline: null,
      listItems: [
        {
          id: 0,
          title: "test1",
          isDone: true,
        },
        {
          id: 1,
          title: "asdfasdf",
          isDone: true,
        },
        {
          id: 2,
          title: "new ish",
          isDone: false,
        },
      ],
      defaultItems: [
        {
          id: 0,
          title: "test1",
          isDone: false,
        },
        {
          id: 1,
          title: "asdfasdf",
          isDone: false,
        },
      ],
      backupItemList: [],
      backupDefaultItemList: [],
    };
  },
  components: { TodoListHeader, TodoListBody, TodoListFooter },
  methods: {
    checkboxStatesChanged(state, id) {
      this.listItems[id].isDone = state;
    },
    toggleAll() {
      if (this.isAllDone) this.listItems.forEach((v) => (v.isDone = false));
      else this.listItems.forEach((v) => (v.isDone = true));
    },
    loadDefault() {
      this.backupItemList = this.listItems;
      this.listItems = [...this.defaultItems];
      for (let li of this.listItems) li.isDone = false;
    },
    undoLoadDefault() {
      this.listItems = this.backupItemList;
    },
    saveDefault() {
      this.backupDefaultItemList = this.defaultItems;
      this.defaultItems = [...this.listItems];
    },
    undoSaveDefault() {
      this.defaultItems = this.backupDefaultItemList;
    },
  },
  computed: {
    title() {
      return this.listId;
    },
    numItems() {
      return this.listItems.length;
    },
    numRemaining() {
      return this.listItems.reduce((a, v) => (v.isDone ? a : a + 1), 0);
    },
    isAllDone() {
      return this.listItems.reduce((a, v) => (v.isDone ? a : false), true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-list {
  margin: 30px 0px;
}
</style>
