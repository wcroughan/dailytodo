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
import axios from "axios";
import { backend_url } from "./dtConstants";

export default {
  name: "TodoList",
  props: {
    listId: String,
  },
  data() {
    return {
      title: "Loading...",
      deadline: null,
      listItems: [],
      listCache: {},
      backupItemList: [],
      canceledLoadDefault: false,
    };
  },
  components: { TodoListHeader, TodoListBody, TodoListFooter },
  methods: {
    requestListFromServer(id) {
      const reqParamObj = {
        id: id,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `list?${params}`;
      console.log(backend_request);
      axios.get(backend_request).then((res) => {
        console.log(res.data);
        this.listCache[id] = res.data;

        console.log(this.listId, id);
        if (this.listId == id) {
          this.listItems = this.listCache[id].listItems;
          this.title = this.listCache[id].listTitle;
        }
      });
    },
    checkboxStatesChanged(state, id) {
      this.listItems[id].isDone = state;
    },
    toggleAll() {
      if (this.isAllDone) this.listItems.forEach((v) => (v.isDone = false));
      else this.listItems.forEach((v) => (v.isDone = true));
    },
    loadDefault() {
      this.backupItemList = this.listItems;

      this.canceledLoadDefault = false;
      const reqParamObj = {
        id: this.listId,
        default: true,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `list?${params}`;
      console.log(backend_request);
      axios.get(backend_request).then((res) => {
        console.log(res.data);
        if (!this.canceledLoadDefault) this.listItems = res.data.listItems;
      });
    },
    undoLoadDefault() {
      //TODO this doesn't work with also switching days
      this.canceledLoadDefault = true;
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
  created() {
    this.requestListFromServer(this.listId);
  },
  watch: {
    listId(newval) {
      const cacheval = this.listCache[newval];
      if (cacheval === undefined) {
        this.requestListFromServer(this.listId);
      } else {
        this.listItems = cacheval.listItems;
        this.title = cacheval.listTitle;
      }
    },
  },
  computed: {
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
